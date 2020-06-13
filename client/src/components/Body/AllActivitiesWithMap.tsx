import * as React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import ActivityWithMap from "./ActivityWithMap";

export default (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const [activities, setActivities] = useState(
    JSON.parse(localStorage.getItem("activities"))
  );

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
        })
        .catch((err) =>
          console.error("Error during fetching activities: " + err)
        );
    }, []);
  }

  if (activities === null) {
    return <div>Activities are loading</div>;
  }
  return (
    <div className="allActivitiesWithMap">
      {activities
        .filter((a) => a.mapPolyline.length > 0)
        .slice(0, 5)
        .map((activity) => (
          <ActivityWithMap key={activity.id} activity={activity} />
        ))}
    </div>
  );
};
