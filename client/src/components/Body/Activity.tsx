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

const colorMap = {
  Running: "red",
  Cycling: "green",
  Swimming: "blue"
};

export default props => {
  const color = colorMap[props.activity.activityType];
  return (
    <div className="activity" style={{ backgroundColor: color }}>
      {props.activity.description}
    </div>
  );
};
