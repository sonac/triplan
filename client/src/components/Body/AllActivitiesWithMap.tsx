import * as React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ActivityWithMap from "./ActivityWithMap";

export default (props) => {
  const [cookies, ,] = useCookies(["auth"]);
  const [activities] = useState(JSON.parse(localStorage.getItem("activities")));

  if (!activities) {
    useEffect(() => {
      fetch("/api/v1/user/fetch-activities", {
        headers: {
          Authorization: "Bearer " + cookies.apiKey,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem(
            "activities",
            JSON.stringify(data.stravaActivities)
          );
          window.location.href = "/my-activities";
        });
    }, [cookies.apiKey]);
  }

  if (activities === null) {
    return <div>Activities are loading</div>;
  }
  return (
    <div className="allActivitiesWithMap">
      {activities
        .filter((a) => a.mapPolyline)
        .filter((a) => a.mapPolyline.length > 0)
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        .reverse()
        .slice(0, 5)
        .map((activity) => (
          <ActivityWithMap key={activity.id} activity={activity} />
        ))}
    </div>
  );
};
