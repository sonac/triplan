import * as React from "react";
import { useState } from "react";
import Calendar from "./Calendar";
import AllActivitesWithMap from "./AllActivitiesWithMap";

export default (props) => {
  const [viewType, setViewType] = useState("map");

  return (
    <div className="userActivities">
      <div className="activitiesBody">{viewType === "calendar" ? <Calendar /> : <AllActivitesWithMap />}</div>
    </div>
  );
};
