import * as React from "react";

export interface Plan {
  name: string;
  length: number;
  isActive: boolean;
  type: string;
}

export default (props) => {
  const plans: Array<Plan> = [
    {
      name: "ironman 70.3",
      length: 16,
      isActive: true,
      type: "triathlon",
    },
    {
      name: "ironman 70.3",
      length: 24,
      isActive: false,
      type: "triathlon",
    },
    {
      name: "marathon",
      length: 22,
      isActive: false,
      type: "running",
    },
  ];

  const iconMap = {
    running: "images/shoe_icon.svg",
    triathlon: "images/swim_icon.svg",
  };

  const choosePlan = (planName: string) => {};
  return (
    <div className="plans">
      <div className="plan">
        <div className="newPlan">
          <img style={{ width: "2vw", height: "2vw" }} src="images/plus.svg" />
        </div>
        <p style={{ color: "#3D425E" }}>add plan</p>
      </div>
      {plans.map((p) => (
        <div key={p.name} className="plan">
          <img style={{ width: "5vw", height: "5vw" }} src={iconMap[p.type]} />
          <p className="planLabel">{p.name}</p>
          <p className="planLabel" style={{ color: "#3D425E" }}>
            {p.length} weeks{" "}
          </p>
        </div>
      ))}
    </div>
  );
};
