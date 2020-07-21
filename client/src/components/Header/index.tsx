import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, Link } from "react-router-dom";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export const toKebab = (text: string) => {
  return text.toLocaleLowerCase().replace(/ /g, "-");
};

export default (props) => {
  let history = useHistory();
  const [state, actions] = useGlobal<State, Actions>();
  const [page, setPage] = useState(
    history.location.pathname
      .split("/")[1]
      .toLocaleUpperCase()
      .replace("-", " ")
  );
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

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
          <div
            className="logoutButton"
            onClick={() => {
              removeCookie("apiKey");
              window.location.reload();
            }}
          >
            LOGOUT
          </div>
        </div>
      ) : (
        <div className="authBlock">
          <div
            className="signUpButton"
            onClick={() => actions.authModalSwitch("SIGN UP")}
          >
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
        <Link to="/plans" style={{ textDecoration: "none", color: "white" }}>
          <div className="navItem">PLANS</div>
        </Link>
        <div className="navItem">/</div>
        <Link
          to="/my-activities"
          style={{ textDecoration: "none", color: "white" }}
        >
          <div className="navItem" onClick={() => handleClick("MY ACTIVITIES")}>
            MY ACTIVITIES
          </div>
        </Link>
        <div className="navItem">/</div>
        <Link to="/my-plan" style={{ textDecoration: "none", color: "white" }}>
          <div className="navItem" onClick={() => handleClick("MY PLAN")}>
            MY PLAN
          </div>
        </Link>
      </div>
    </div>
  );
};
