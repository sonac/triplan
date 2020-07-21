import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";
import AllActivitesWithMap from "./AllActivitiesWithMap";

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [maps, setMaps] = useState(JSON.parse(localStorage.getItem("maps")));
  const [url, setUrl] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  if (state.user === null) {
    return (
      <div style={{ color: "white" }}>Sign in to view your activities</div>
    );
  }

  const handleClick = () => {
    window.location.href =
      "http://www.strava.com/oauth/authorize?client_id=37166&response_type=code&approval_prompt=force&scope=read_all,activity:read_all&redirect_uri=http://localhost:3000/exchange-token";
  };

  return (
    <div className="userActivities">
      {state.user.connectedToStrava ? (
        <div className="activitiesBody">
          <div
            className="connectToStrava"
            style={{
              textAlign: "center",
              color: "white",
              fontSize: "2em",
              borderRadius: "5em",
              backgroundColor: "#fc5200",
              display: "flex",
              justifyContent: "center",
              marginLeft: "45vw",
              marginRight: "45vw",
            }}
            onClick={() => setUrl("/api/v1/user/fetch-activities")}
          >
            Refresh strava Activities
          </div>
          <AllActivitesWithMap />
        </div>
      ) : (
        <div
          className="connectToStrava"
          style={{
            textAlign: "center",
            color: "white",
            fontSize: "2em",
            borderRadius: "5em",
            backgroundColor: "#fc5200",
            display: "flex",
            justifyContent: "center",
            marginLeft: "45vw",
            marginRight: "45vw",
          }}
          onClick={() => handleClick()}
        >
          Connect to Strava
        </div>
      )}
    </div>
  );
};
