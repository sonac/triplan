import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export default (props) => {
  let history = useHistory();
  const [state, actions] = useGlobal<State, Actions>();
  const [page, setPage] = useState(history.location.pathname.toLocaleUpperCase().replace("/", "").replace("-", " "));
  const [_, __, removeCookie] = useCookies(["auth"]);

  const toKebab = (text: string) => {
    return text.toLocaleLowerCase().replace(/ /g, "-");
  };

  const handleClick = (page) => {
    setPage(page);
    history.push(toKebab(page));
  };

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
        <div className="navItem" onClick={() => handleClick("PLANS")}>
          PLANS
        </div>
        <div className="navItem">/</div>
        <div className="navItem" onClick={() => handleClick("MY ACTIVITIES")}>
          MY ACTIVITIES
        </div>
        <div className="navItem">/</div>
        <div className="navItem" onClick={() => handleClick("MY PLAN")}>
          MY PLAN
        </div>
      </div>
    </div>
  );
};
