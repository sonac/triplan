import { expect } from "chai";
import { addDatesToActivities, nextMonday } from "../../src/utils/userUtils";
import { IPlan } from "../../src/models/plan";

describe("transforming plan to user activities", () => {
  it("should transform plan to list of dated user activities", () => {
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
          },
          wednesday: {
            sessionName: "Steady",
            distance: "4M",
            pace: "9:45/Mile",
            time: "39",
            intensity: "6/10",
          },
          thursday: {
            sessionName: "Fartlek",
            distance: "4M",
            pace: "10:00/Mile",
            time: "40",
            intensity: "7/10",
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
          },
          sunday: {
            sessionName: "Race",
            distance: "10K",
            pace: "9:00",
            time: "55",
            intensity: "9/10",
          },
        },
      ],
    };
    const startDate = new Date("2020-07-18");
    const monday = new Date("2020-07-20");
    const expected = [1, 2, 3];
    expect(
      addDatesToActivities(startDate, somePlan).filter(
        (t) => t.description === "Rest"
      )[0].date
    ).to.eql(monday);
  });
  it("should properly calculate next monday", () => {
    const date = new Date("2020-07-17");
    const monday = new Date("2020-07-20");
    expect(nextMonday(date)).to.eql(monday);
  });
});
