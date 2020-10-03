import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";
import { toKebab } from "../Header";
import { daysOfWeek } from "./Calendar";
import { IInterval } from "./AllPlans";
import "./styles.scss";

export default () => {
  const { planName } = useParams();
  const [cookies, ,] = useCookies(["auth"]);
  const [state] = useGlobal<State, Actions>();
  const [plan, setPlan] = useState(
    state.plans
      ? state.plans.filter((p) => toKebab(p.name) === planName)[0]
      : null
  );
  const [week, setWeek] = useState(1);
  const [isSendding, setIsSending] = useState(false);

  const extendedDaysOfWeek = (weekNumber: number): string[] =>
    [weekNumber.toString() + " week"].concat(daysOfWeek);

  const stringifyInterval = (interval: IInterval): string =>
    `${interval.amount}x ${interval.fastDistance || interval.fastTime} with ${
      interval.restDistance || interval.restTime
    } rest`;

  const max = (numX: number, numY: number): number =>
    numX > numY ? numX : numY;

  const min = (numX: number, numY: number): number =>
    numX < numY ? numX : numY;

  useEffect(() => {
    if (!plan) {
      fetch(`/api/v1/plan/${planName}`).then((resp) =>
        resp.json().then((data) => {
          setPlan(data);
        })
      );
    }
  });

  const activatePlan = useCallback(
    async (activationPlan) => {
      if (activationPlan && !isSendding) {
        setIsSending(true);
        await fetch("/api/v1/user/activate-plan", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + cookies.apiKey,
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(activationPlan),
        });
        window.location.href = "/my-plan";
        setIsSending(false);
      } else return;
    },
    [isSendding, cookies.apiKey]
  );

  if (!plan) {
    return <div>Plan is loading</div>;
  }
  return (
    <div>
      <div className="startPlanButton" onClick={() => activatePlan(plan)}>
        {state.user ? "START THIS PLAN" : ""}
      </div>
      <div className="planContainer">
        <img
          className="leftArrow"
          src="/images/left_arrow.svg"
          onClick={() => setWeek(max(1, week - 1))}
          alt=""
        />
        <table className="planDetails">
          <thead>
            <tr>
              {extendedDaysOfWeek(week).map((day) => (
                <th key={day} style={{ color: "white" }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Session Name
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {
                        plan.trainings[week - 1][
                          extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                        ].sessionName
                      }
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Distance
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {
                        plan.trainings[week - 1][
                          extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                        ].distance
                      }
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Interval
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {plan.trainings[week - 1][
                        extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                      ].interval
                        ? stringifyInterval(
                            plan.trainings[week - 1][
                              extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                            ].interval
                          )
                        : ""}
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Pace
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {
                        plan.trainings[week - 1][
                          extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                        ].pace
                      }
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Time
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {
                        plan.trainings[week - 1][
                          extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                        ].time
                      }
                    </td>
                  );
                }
              })}
            </tr>
            <tr>
              {[...Array(8).keys()].map((dayNumber) => {
                if (dayNumber === 0) {
                  return (
                    <td key={dayNumber} style={{ color: "white" }}>
                      Intensity
                    </td>
                  );
                } else {
                  return (
                    <td
                      key={dayNumber}
                      style={{ color: "white", fontFamily: "Arial" }}
                    >
                      {
                        plan.trainings[week - 1][
                          extendedDaysOfWeek(week)[dayNumber].toLowerCase()
                        ].intensity
                      }
                    </td>
                  );
                }
              })}
            </tr>
          </tbody>
        </table>
        <img
          className="rightArrow"
          src="/images/left_arrow.svg"
          onClick={() => setWeek(min(week + 1, plan.length))}
          alt=""
        />
      </div>
    </div>
  );
};
