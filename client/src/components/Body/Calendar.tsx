import * as React from "react";
import { useState } from "react";
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

const getCurrentYear = () => {
  return moment().year();
};

const getMonth = (monthIdx: number) => {
  return moment().month(monthIdx);
};

const getMonthDays = (
  month: number,
  fromDay: number = 1,
  amountOfDays: number = moment().month(month).daysInMonth()
) => {
  return Array.from(
    { length: Math.max(amountOfDays - (fromDay - 1), 0) },
    (_, i) => fromDay + i
  ).map((day) => new Date(moment().year(), month, day));
};

// Previous month from January is December
const safeMonthSubstraction = (monthIdx: number): number =>
  monthIdx === 0 ? 11 : monthIdx - 1;

// Calculate how many days from previous month we need to take to fill first week
const getLeftoverDaysFromPrevMonth = (monthIdx: number, dayOfWeek: number) => {
  const fromDay: number =
    moment().month(safeMonthSubstraction(monthIdx)).daysInMonth() -
    dayOfWeek +
    1;
  const days: Array<Date> = getMonthDays(moment().month() - 1, fromDay);
  return days;
};

const buildMonthCalendar = (monthIdx: number) => {
  const firstDayOfMonth =
    moment().year(getCurrentYear()).month(monthIdx).date(1).isoWeekday() - 1;
  const lastDayOfMonth =
    moment()
      .year(getCurrentYear())
      .month(monthIdx)
      .date(moment().month(monthIdx).daysInMonth())
      .isoWeekday() - 1;
  const prevMonthDays = getLeftoverDaysFromPrevMonth(monthIdx, firstDayOfMonth);
  const thisMonthDays = getMonthDays(monthIdx);
  const nextMonthDays = getMonthDays(monthIdx + 1, 1, 6 - lastDayOfMonth);
  const month = prevMonthDays.concat(thisMonthDays).concat(nextMonthDays);
  return Array.from({ length: month.length / 7 }, (_, i) => 0 + i).map((_, n) =>
    month.slice(n * 7, (n + 1) * 7)
  );
};

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [monthIdx, setMonth] = useState(moment().month());
  const [yearIdx, setYear] = useState(moment().year());

  const month: string = moment().month(monthIdx).format("MMMM");
  const year: string = moment().year(yearIdx).format("YYYY");

  const safeMonthYearSubstraction = (monthIdx: number): number => {
    if (monthIdx === 0) {
      setYear(yearIdx - 1);
      return 11;
    }
    return monthIdx - 1;
  };

  const safeMonthYearAddition = (monthIdx: number): number => {
    if (monthIdx === 11) {
      setYear(yearIdx + 1);
      return 0;
    }
    return monthIdx + 1;
  };

  const plannedActivities: Array<Activity> = state.user
    ? state.user.activities.map((activity) => {
        return { ...activity, date: new Date(activity.date) };
      })
    : [];
  return (
    <div className="calendarContainer">
      <div className="month">{month}</div>
      <div className="year">{year}</div>
      <img
        className="leftArrow"
        src="images/left_arrow.svg"
        onClick={() => setMonth(safeMonthYearSubstraction(monthIdx))}
      />
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
            {buildMonthCalendar(monthIdx).map((week) => (
              <tr className="calendarTR" key={week.toString()}>
                {week.map((day) => {
                  console.log(
                    moment().year(yearIdx).month(monthIdx).day(day.getDate())
                  );
                  console.log(plannedActivities);
                  const filteredActivities = plannedActivities.filter(
                    (activity) =>
                      moment()
                        .year(yearIdx)
                        .month(monthIdx)
                        .day(day.getDate())
                        .isSame(activity.date, "day")
                  );
                  return filteredActivities.length > 0 ? (
                    <td className="calendarTD" key={day.getDate()}>
                      {day.getDate()}
                      <div className="activitiesContainer">
                        {filteredActivities.map((activity) => (
                          <ActivityComponent activity={activity} />
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
      <img
        className="rightArrow"
        src="images/left_arrow.svg"
        onClick={() => setMonth(safeMonthYearAddition(monthIdx))}
      />
    </div>
  );
};
