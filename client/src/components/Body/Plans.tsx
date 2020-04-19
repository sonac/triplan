import * as React from "react";

export interface Plan {
  name: string;
  length: number;
  intencity: string;
}

export default props => {
  const plans: Array<Plan> = [
    {
      name: "16 weeks Ironman 70.3 prep",
      length: 16,
      intencity: "medium"
    },
    {
      name: "24 weeks Ironman 70.3 prep",
      length: 24,
      intencity: "low"
    },
    {
      name: "12 weeks Ironman 70.3 prep",
      length: 12,
      intencity: "high"
    }
  ];

  const choosePlan = (planName: string) => {};
  return (
    <div className="plans">
      {plans.map(p => (
        <div key={p.name} className="plan">
          {p.name}
          <img src="images/plan.jpg" />
        </div>
      ))}
    </div>
  );
};
