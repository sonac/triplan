import * as React from "react";
import * as moment from "moment";
import ActivityComponent, { Activity } from "./Activity";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
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
  amountOfDays: number = moment()
    .month(month)
    .daysInMonth()
) => {
  return Array.from(
    { length: Math.max(amountOfDays - (fromDay - 1), 0) },
    (_, i) => fromDay + i
  ).map(day => new Date(moment().year(), month, day));
};

const getCurrentMonthDays = () => {
  return moment().daysInMonth();
};

const getPreviousMonthDays = () => {
  const prevMonth = moment().month(getPreviousMonth());
  return prevMonth.daysInMonth();
};

// Calculate how many days from previous month we need to take to fill first week
const getLeftoverDaysFromPrevMonth = dayOfWeek => {
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

export default props => {
  const plannedActivities: Array<Activity> = [
    {
      activityType: "Cycling",
      date: new Date(2020, 2, 7),
      description: "Ride 20 km"
    },
    {
      activityType: "Running",
      date: new Date(2020, 2, 7),
      description: "Run 10 km Zone2"
    },
    {
      activityType: "Swimming",
      date: new Date(2020, 2, 12),
      description: "Swim 1 km"
    },
    {
      activityType: "Cycling",
      date: new Date(2020, 2, 16),
      description: "Ride 40 km"
    }
  ];

  buildMonthCalendar().forEach(week =>
    week.forEach(day => {
      console.log(day.toISOString());
      console.log(plannedActivities[0].date.toISOString());
      console.log(
        plannedActivities.filter(
          activity => activity.date.getTime() === day.getTime()
        )
      );
    })
  );

  return (
    <div className="calendar">
      <table>
        <caption>{moment().format("MMMM")}</caption>
        <thead>
          <tr>
            {daysOfWeek.map(dayOfWeek => (
              <th key={dayOfWeek}>{dayOfWeek}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buildMonthCalendar().map(week => (
            <tr key={week.toString()}>
              {week.map(day =>
                plannedActivities.filter(
                  activity => activity.date.getTime() === day.getTime()
                ).length > 0 ? (
                  <td key={day.getDate()}>
                    {day.getDate()}
                    {plannedActivities
                      .filter(
                        activity => activity.date.getTime() === day.getTime()
                      )
                      .map(activity => (
                        <ActivityComponent activity={activity} />
                      ))}
                  </td>
                ) : (
                  <td key={day.getDate()}>{day.getDate()}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
