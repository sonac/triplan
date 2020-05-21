import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [page, setPage] = useState("PLANS");
  const [_, __, removeCookie] = useCookies(["auth"]);

  const menuItems = ["PLANS", "ALL ACTIVITIES", "MY PLAN"];

  const buttonPressed = state.authModal === null ? "inset" : "";

  return (
    <div className="header">
      <div className="current">{page}</div>
      {state.user ? (
        <div className="authBlock">
          <img src="images/runner.png" />
          <div className="logoutButton" onClick={() => removeCookie("auth")}>
            LOGOUT
          </div>
        </div>
      ) : (
        <div className="authBlock">
          <div className="signUpButton" onClick={() => actions.authModalSwitch("SIGN UP")}>
            SIGN UP
          </div>
          <div
            className="loginButton"
            style={{
              boxShadow: `${buttonPressed} 4px 4px 12px #363a4f, ${buttonPressed} -4px -4px 12px #000000`,
            }}
            onClick={() => actions.authModalSwitch("LOGIN")}
          >
            LOGIN
          </div>
        </div>
      )}
      <div className="navBar">
        <div className="navItem" onClick={() => setPage("PLANS")}>
          PLANS
        </div>
        <div className="navItem">/</div>
        <div className="navItem" onClick={() => setPage("ALL ACTIVITIES")}>
          ALL ACTIVITIES
        </div>
        <div className="navItem">/</div>
        <div className="navItem" onClick={() => setPage("MY PLAN")}>
          MY PLAN
        </div>
      </div>
    </div>
  );
};
