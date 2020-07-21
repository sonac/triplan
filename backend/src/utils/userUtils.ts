import { IPlan, IPlanWeek, IPlanDay } from "../models/plan";
import { stringifyTrainingDay } from "./stringUtils";

interface ActivityWithDate {
  activityType: string;
  date: Date;
  description: string;
}

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const addDatesToActivities = (
  startDate: Date,
  plan: IPlan
): ActivityWithDate[] => {
  let date = nextMonday(startDate);
  //console.log(plan)
  // @ts-ignore
  return plan.trainings.flatMap((tw) => {
    const res = weekOfActivities(date, tw);
    //console.log(res)
    date.setDate(date.getDate() + 7);
    return res;
  });
};

export const nextMonday = (date: Date): Date => {
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
};

const weekOfActivities = (date: Date, week: IPlanWeek): ActivityWithDate[] => {
  const activities: ActivityWithDate[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    const dow: string = days[date.getDay()];
    // @ts-ignore
    const trainingDay: IPlanDay = week[dow];
    activities.push({
      activityType: "Running",
      date: d,
      description: stringifyTrainingDay(trainingDay),
    });
    date.setDate(date.getDate() + 1);
  }
  return activities;
};
