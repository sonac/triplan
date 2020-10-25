import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Modal from "react-modal";
import { useGlobal, State, Actions } from "../../state";
import { toKebab } from "../Header/index";
import { customStyles } from "./Body";

export interface IInterval extends Document {
  fastDistance: number | null;
  fastTime: number | null;
  restDistance: number | null;
  restTime: number | null;
  amount: number;
}

export interface IPlanDay extends Document {
  sessionName: string;
  distance: string | null;
  interval: IInterval | null;
  pace: string | null;
  time: string | null;
  intensity: string | null;
}

export interface IPlanWeek extends Document {
  monday: IPlanDay;
  tuesday: IPlanDay;
  wednesday: IPlanDay;
  thursday: IPlanDay;
  friday: IPlanDay;
  saturday: IPlanDay;
  sunday: IPlanDay;
}

export interface IPlan extends Document {
  name: string;
  length: number;
  type: string;
  target: string;
  trainings: IPlanWeek[];
}

export default (props) => {
  const [plans, setPlans] = useState(null);
  const [addPlanModal, switchPlanModal] = useState(false);
  const [, actions] = useGlobal<State, Actions>();

  useEffect(() => {
    if (!plans) {
      fetch("/api/v1/plan/all").then((res) =>
        res
          .json()
          .then((data) => {
            setPlans(data);
            actions.setPlans(data);
          })
          .catch((err) => {
            throw new Error(err);
          })
      );
    }
  }, [actions, plans]);

  const iconMap = {
    Running: "images/shoe_icon.svg",
    Triathlon: "images/swim_icon.svg",
  };

  const cutName = (name: string): string =>
    name.split(" ").slice(0, 2).join(" ");

  if (!plans) {
    return <div>Plans are loading</div>;
  }
  return (
    <div className="plans">
      <div className="plan">
        <div className="newPlan">
          <img
            style={{ width: "2vw", height: "2vw" }}
            src="images/plus.svg"
            alt=""
            onClick={() => switchPlanModal(true)}
          />
        </div>
        <p style={{ color: "#3D425E" }}>add plan</p>
      </div>
      <Modal
        isOpen={addPlanModal}
        onRequestClose={() => switchPlanModal(false)}
        style={customStyles}
      >
        <div className="activityModal">
          Please send your suggested plan for adding to sonag007@gmail.com Or
          submit the PR for
          https://github.com/sonac/triplan/tree/master/backend/resources/plans
        </div>
      </Modal>
      {plans.map((p) => (
        <Link to={`plan/${toKebab(p.name)}`}>
          <div key={p.name} className="plan">
            <img
              style={{ width: "4vw", height: "4vw" }}
              src={iconMap[p.type]}
              alt=""
            />
            <p className="planLabel">{cutName(p.name)}</p>
            <p className="planLabel">{p.target}</p>
            <p className="planLabel" style={{ color: "#3D425E" }}>
              {p.length} weeks{" "}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
