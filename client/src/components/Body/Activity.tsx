import * as React from "react";

export interface Activity {
  activityType: string;
  date: Date;
  description: string;
}

export interface MapActivity {
  id: number;
  distance: number;
  movingTime: number;
  elapsedTime: number;
  activityType: string;
  startDate: Date;
  averageSpeed: number;
  averageWatts: number;
  mapPolyline: string;
}

const iconMap = {
  Running: "images/shoe_icon.svg",
  Cycling: "images/bike_icon.svg",
  Swimming: "images/swim_icon.svg",
  Rest: "images/rest.png",
};

export default (props) => {
  console.log(props.activity.activityType);
  const icon = iconMap[props.activity.activityType];
  return (
    <div className="activity">
      <img src={icon} alt="" />
    </div>
  );
};
