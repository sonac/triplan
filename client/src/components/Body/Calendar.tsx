import * as React from "react";
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

const getCurrentMonth = () => {
  return moment().month();
};

const getPreviousMonth = () => {
  return moment().month() - 1;
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

const getCurrentMonthDays = () => {
  return moment().daysInMonth();
};

const getPreviousMonthDays = () => {
  const prevMonth = moment().month(getPreviousMonth());
  return prevMonth.daysInMonth();
};

// Calculate how many days from previous month we need to take to fill first week
const getLeftoverDaysFromPrevMonth = (dayOfWeek) => {
  const fromDay: number = getPreviousMonthDays() - dayOfWeek + 1;
  const days: Array<Date> = getMonthDays(moment().month() - 1, fromDay);
  return days;
};

const buildMonthCalendar = () => {
  const firstDayOfMonth =
    moment()
      .year(getCurrentYear())
      .month(getCurrentMonth())
      .date(1)
      .isoWeekday() - 1;
  const lastDayOfMonth =
    moment()
      .year(getCurrentYear())
      .month(getCurrentMonth())
      .date(getCurrentMonthDays())
      .isoWeekday() - 1;
  const prevMonthDays = getLeftoverDaysFromPrevMonth(firstDayOfMonth);
  const thisMonthDays = getMonthDays(moment().month());
  const nextMonthDays = getMonthDays(
    moment().month() + 1,
    1,
    6 - lastDayOfMonth
  );
  const month = prevMonthDays.concat(thisMonthDays).concat(nextMonthDays);
  return Array.from({ length: month.length / 7 }, (_, i) => 0 + i).map((_, n) =>
    month.slice(n * 7, (n + 1) * 7)
  );
};

const month: string = moment().format("MMMM");
const year: string = moment().format("YYYY");

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();

  const plannedActivities: Array<Activity> = state.user
    ? state.user.activities.map((activity) => {
        return { ...activity, date: new Date(activity.date) };
      })
    : [];
  console.log(plannedActivities);
  return (
    <div className="calendarContainer">
      <div className="month">{month}</div>
      <div className="year">{year}</div>
      <img className="leftArrow" src="images/left_arrow.svg" />
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
            {buildMonthCalendar().map((week) => (
              <tr className="calendarTR" key={week.toString()}>
                {week.map((day) => {
                  const filteredActivities = plannedActivities.filter(
                    (activity) => moment(day).isSame(activity.date, "day")
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
      <img className="rightArrow" src="images/left_arrow.svg" />
    </div>
  );
};
