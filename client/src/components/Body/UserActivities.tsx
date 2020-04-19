import * as React from "react";
import { useState } from "react";
import Calendar from "./Calendar";
import AllActivitesWithMap from "./AllActivitiesWithMap";

export default props => {
  const [viewType, setViewType] = useState("map");

  return (
    <div className="userActivities">
      <div className="chooseViewTypes">
        <div className="viewTypeButton" onClick={() => setViewType("calendar")}>
          Calendar View
        </div>
        <div className="viewTypeButton" onClick={() => setViewType("map")}>
          Map View
        </div>
      </div>
      <div className="activitiesBody">
        {viewType === "calendar" ? <Calendar /> : <AllActivitesWithMap />}
      </div>
    </div>
  );
};
