import { expect } from "chai";
import {
  addDatesToActivities,
  nextMonday,
  weekOfActivities,
} from "../../src/utils/userUtils";

describe("transforming plan to user activities", () => {
  const somePlan: any = {
    name: "Half Marathon Sub 2 hours",
    length: 12,
    type: "Running",
    target: "Sub 2:00",
    trainings: [
      {
        monday: {
          sessionName: "Rest",
        },
        tuesday: {
          sessionName: "Speedwork",
          distance: "4M",
          interval: {
            fastDistance: 600,
            restDistance: 200,
            amount: 4,
          },
          pace: "10K",
          time: "40",
          intencity: "8/10",
          type: "Running",
        },
        wednesday: {
          sessionName: "Steady",
          distance: "4M",
          pace: "9:45/Mile",
          time: "39",
          intensity: "6/10",
          type: "Running",
        },
        thursday: {
          sessionName: "Fartlek",
          distance: "4M",
          pace: "10:00/Mile",
          time: "40",
          intensity: "7/10",
          type: "Running",
        },
        friday: {
          sessionName: "Rest",
        },
        saturday: {
          sessionName: "Easy",
          distance: "3M",
          pace: "11:00",
          time: "33",
          intensity: "4/10",
          type: "Running",
        },
        sunday: {
          sessionName: "Race",
          distance: "10K",
          pace: "9:00",
          time: "55",
          intensity: "9/10",
          type: "Running",
        },
      },
      {
        monday: {
          sessionName: "Rest",
        },
        tuesday: {
          sessionName: "Speedwork",
          distance: "4M",
          interval: {
            fastDistance: 600,
            restDistance: 200,
            amount: 4,
          },
          pace: "10K",
          time: "40",
          intencity: "8/10",
          type: "Running",
        },
        wednesday: {
          sessionName: "Steady",
          distance: "4M",
          pace: "9:45/Mile",
          time: "39",
          intensity: "6/10",
          type: "Running",
        },
        thursday: {
          sessionName: "Fartlek",
          distance: "4M",
          pace: "10:00/Mile",
          time: "40",
          intensity: "7/10",
          type: "Running",
        },
        friday: {
          sessionName: "Easy",
          distance: "3M",
          pace: "11:00",
          time: "33",
          intensity: "4/10",
          type: "Running",
        },
        saturday: {
          sessionName: "Rest",
        },
        sunday: {
          sessionName: "Race",
          distance: "10K",
          pace: "9:00",
          time: "55",
          intensity: "9/10",
          type: "Running",
        },
      },
    ],
  };
  it("should transform plan to list of dated user activities", () => {
    const startDate = new Date("2020-07-18");
    const restDays = [
      new Date("2020-07-20"),
      new Date("2020-07-24"),
      new Date("2020-07-27"),
      new Date("2020-08-01"),
    ];
    expect(
      addDatesToActivities(startDate, somePlan)
        .filter((t) => t.description === "Rest")
        .map((a) => a.date)
    ).to.eql(restDays);
  });
  it("should properly calculate next monday", () => {
    const date = new Date("2020-07-17");
    const monday = new Date("2020-07-20");
    expect(nextMonday(date)).to.eql(monday);
  });
  it("should properly transform one week of activities", () => {
    const week = somePlan.trainings[0];
    const date = new Date("2020-07-18");
    expect(
      weekOfActivities(date, week).filter(
        (a) => a.description === "Speedwork for 4M with 10K pace during 40"
      )[0]
    ).to.eql({
      activityType: "Running",
      date: new Date("2020-07-21"),
      description: "Speedwork for 4M with 10K pace during 40",
    });
  });
});
