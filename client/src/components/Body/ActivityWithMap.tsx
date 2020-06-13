import * as React from "react";
import { MapActivity } from "./Activity";
import Map from "./Map";
import * as polyline from "@mapbox/polyline";
import moment from "moment";

const reverseCoordinatess = (crds: Array<number>) => [crds[1], crds[0]];

export default (props) => {
  const activity: MapActivity = props.activity;

  const iconMap = {
    Run: "images/shoe_icon.svg",
    Bike: "images/bike_icon.svg",
    Swim: "images/swim_icon.svg",
  };

  return (
    <div className="activityWithMap" style={{ margin: "3vw" }}>
      <p
        style={{
          fontWeight: "bold",
          fontSize: "2em",
          fontFamily: "Soulmaze",
          alignSelf: "flex-end",
          textAlign: "center",
          marginBottom: "0",
        }}
      >
        {activity.activityType.toLocaleUpperCase()}
      </p>
      <img
        className="icon"
        style={{ gridColumn: "1", gridRow: "3 / 3" }}
        src={iconMap[activity.activityType]}
      />
      <p style={{ gridColumn: "2", gridRow: "1", alignSelf: "flex-end" }}>
        {Math.floor(activity.distance / 10) / 100} km
      </p>
      <p style={{ gridColumn: "3", gridRow: "1", alignSelf: "flex-end" }}>
        171 HR
      </p>
      <p style={{ gridColumn: "2", gridRow: "2" }}>5.49 m/km</p>
      <p style={{ gridColumn: "3", gridRow: "2" }}>29 m 26s</p>
      <p
        style={{
          gridColumn: "4 / 4",
          gridRow: "2 / 3",
          fontFamily: "Soulmaze Brush",
          fontSize: "3em",
          marginTop: "0",
          marginBottom: "0",
        }}
      >
        {moment(new Date(activity.startDate)).format("DD MMM")}
      </p>
      <div className="activityMap">
        <Map
          path={polyline
            .decode(activity.mapPolyline)
            .map((crds) => reverseCoordinatess(crds))}
        />
      </div>
    </div>
  );
};
