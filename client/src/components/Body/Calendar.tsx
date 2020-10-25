import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import moment from "moment";
import ActivityComponent, { Activity } from "./Activity";
import { useGlobal, State, Actions } from "../../state";

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getMonthDays = (
  yearIdx: number,
  monthIdx: number,
  fromDay: number = 1,
  toDay: number = moment().year(yearIdx).month(monthIdx).daysInMonth()
): Date[] => {
  return Array.from(
    { length: Math.max(toDay - (fromDay - 1), 0) },
    (_, i) => fromDay + i
  ).map((day) => new Date(yearIdx, monthIdx, day));
};

// Previous month from January is December
const safeMonthSubstraction = (monthIdx: number): number =>
  monthIdx === 0 ? 11 : monthIdx - 1;

// Calculate how many days from previous month we need to take to fill first week
const getLeftoverDaysFromPrevMonth = (
  yearIdx: number,
  monthIdx: number,
  dayOfWeek: number
): Date[] => {
  const fromDay: number =
    moment().month(safeMonthSubstraction(monthIdx)).daysInMonth() -
    dayOfWeek +
    1;
  const days: Date[] = getMonthDays(yearIdx, monthIdx - 1, fromDay);
  return days;
};

const buildMonthCalendar = (monthIdx: number, yearIdx: number): Date[][] => {
  const firstDayOfMonth =
    moment().year(yearIdx).month(monthIdx).date(1).isoWeekday() - 1;
  const lastDayOfMonth =
    moment()
      .year(yearIdx)
      .month(monthIdx)
      .date(moment().month(monthIdx).daysInMonth())
      .isoWeekday() - 1;
  const prevMonthDays = getLeftoverDaysFromPrevMonth(
    yearIdx,
    monthIdx,
    firstDayOfMonth
  );
  const thisMonthDays = getMonthDays(yearIdx, monthIdx);
  let nextMonthDays = getMonthDays(
    yearIdx,
    monthIdx + 1,
    1,
    6 - lastDayOfMonth
  );
  // add one more week in case in total month calendar will be 5 weeks
  while (
    (prevMonthDays.length + thisMonthDays.length + nextMonthDays.length) / 7 <
    6
  ) {
    nextMonthDays = nextMonthDays.concat(
      getMonthDays(
        yearIdx,
        monthIdx + 1,
        nextMonthDays.length + 1,
        nextMonthDays.length + 8
      )
    );
  }
  const month = prevMonthDays.concat(thisMonthDays).concat(nextMonthDays);
  return Array.from({ length: month.length / 7 }, (_, i) => 0 + i).map((_, n) =>
    month.slice(n * 7, (n + 1) * 7)
  );
};

export default () => {
  const [state, actions] = useGlobal<State, Actions>();
  const [monthIdx, setMonth] = useState(moment().month());
  const [yearIdx, setYear] = useState(moment().year());
  const [cookies, ,] = useCookies(["auth"]);

  const month: string = moment().month(monthIdx).format("MMMM");
  const year: string = moment().year(yearIdx).format("YYYY");

  const safeMonthYearSubstraction = (mIdx: number): number => {
    if (mIdx === 0) {
      setYear(yearIdx - 1);
      return 11;
    }
    return mIdx - 1;
  };

  const safeMonthYearAddition = (mIdx: number): number => {
    if (mIdx === 11) {
      setYear(yearIdx + 1);
      return 0;
    }
    return mIdx + 1;
  };

  const stopPlan = async (): Promise<void> => {
    const resp = await fetch("/api/v1/user/stop-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + cookies.apiKey,
      },
    });
    window.location.href = "/plan";
  };

  const plannedActivities: Activity[] = state.user
    ? state.user.activities.map((activity: any) => {
        return { ...activity, date: new Date(activity.date) };
      })
    : [];

  return (
    <div className="wrapper">
      <div className="calendarContainer">
        <div className="dateContainer">
          <img
            className="leftArrow"
            src="images/left_arrow.svg"
            onClick={() => setMonth(safeMonthYearSubstraction(monthIdx))}
            alt=""
          />
          <div className="monthYear">
            {month} {year}
          </div>

          <img
            className="rightArrow"
            src="images/left_arrow.svg"
            onClick={() => setMonth(safeMonthYearAddition(monthIdx))}
            alt=""
          />
        </div>
        <div className="calendar">
          <table>
            <thead>
              <tr>
                {daysOfWeek.map((dayOfWeek) => (
                  <th className="calendarTH" key={dayOfWeek}>
                    <div className="dowContainer">{dayOfWeek}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buildMonthCalendar(monthIdx, yearIdx).map((week) => (
                <tr className="calendarTR" key={week.toString()}>
                  {week.map((day) => {
                    const filteredActivities = plannedActivities.filter(
                      (activity) => moment(activity.date).isSame(day, "day")
                    );
                    return filteredActivities.length > 0 ? (
                      <td className="calendarTD" key={day.getDate()}>
                        {day.getDate()}
                        <div className="activitiesContainer">
                          {filteredActivities.map((activity) => (
                            <div
                              onClick={() =>
                                actions.activityModalSwitch(activity)
                              }
                            >
                              <ActivityComponent activity={activity} />
                            </div>
                          ))}
                        </div>
                      </td>
                    ) : (
                      <td key={day.getDate()}>{day.getDate()}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="connectToStrava"
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "2em",
          borderRadius: "5em",
          backgroundColor: "#fc5200",
          display: "flex",
          justifyContent: "center",
          marginLeft: "45vw",
          marginRight: "45vw",
        }}
        onClick={() => stopPlan()}
      >
        Stop plan
      </div>
    </div>
  );
};
