import * as React from "react";
import { MapActivity } from "./Activity";
import Map from "./Map";
import * as polyline from "@mapbox/polyline";

const reverseCoordinatess = (crds: Array<number>) => [crds[1], crds[0]];

export default props => {
  const activity: MapActivity = props.activity;

  return (
    <div className="activityWithMap" style={{ margin: "3vw" }}>
      <div className="activityHeader">
        <p>{activity.activityType}</p>
        <p>{activity.distance / 1000} km</p>
        <p>171 HR</p>
        <p style={{ gridColumn: "2" }}>5.49 m/km</p>
        <p style={{ gridColumn: "3" }}>29 m 26s</p>
      </div>
      <div className="activityMap">
        <Map
          path={polyline
            .decode(activity.mapPolyline)
            .map(crds => reverseCoordinatess(crds))}
        />
      </div>
    </div>
  );
};
