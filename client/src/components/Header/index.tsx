import * as React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, Link } from "react-router-dom";
import { useGlobal, State, Actions } from "../../state";
import "./styles.scss";

export const toKebab = (text: string) => {
  return text.toLocaleLowerCase().replace(/ /g, "-");
};

export default (props) => {
  const history = useHistory();
  const [state, actions] = useGlobal<State, Actions>();
  const [page, setPage] = useState(
    history.location.pathname
      .split("/")[1]
      .toLocaleUpperCase()
      .replace("-", " ")
  );
  const [, , removeCookie] = useCookies(["auth"]);

  const handleClick = (pageLink) => {
    setPage(pageLink);
    history.push(toKebab(pageLink));
  };

  const buttonPressed = state.authModal === null ? "" : "inset";

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
              boxShadow: `${buttonPressed} 4px 4px 12px 0 #0f1015, ${buttonPressed} -4px -4px 12px #313548`,
            }}
            onClick={() => actions.authModalSwitch("LOGIN")}
          >
            LOGIN
          </div>
        </div>
      )}
      <div className="navBar">
        <Link to="/plans" style={{ textDecoration: "none", color: "white" }}>
          <div className="navItem" style={{ textAlign: "right" }}>
            PLANS
          </div>
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
          <div
            className="navItem"
            style={{ textAlign: "left" }}
            onClick={() => handleClick("MY PLAN")}
          >
            MY PLAN
          </div>
        </Link>
      </div>
    </div>
  );
};
