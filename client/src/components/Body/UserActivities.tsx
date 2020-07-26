import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";
import AllActivitesWithMap from "./AllActivitiesWithMap";

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [isSendding, setIsSending] = useState(false);
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

  const refreshActivities = async (): Promise<void> => {
    if (isSendding) return;
    setIsSending(true);
    await fetch(`/api/v1/user/fetch-activities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + cookies.apiKey,
      },
    })
      .then((resp) => {
        resp.json().then((d) => {
          console.log(d);
          localStorage.setItem(
            "activities",
            JSON.stringify(d.stravaActivities)
          );
          window.location.href = "/my-activities";
        });
      })
      .catch((err) => console.error(err));
    setIsSending(false);
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
            onClick={() => refreshActivities()}
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
