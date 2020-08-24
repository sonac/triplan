import * as React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";
import { Body } from "../Body";
import Header from "../Header";
import "./styles.scss";

export default (props) => {
  const [cookies, , removeCookie] = useCookies(["auth"]);
  const [, actions] = useGlobal<State, Actions>();

  if (cookies) {
    useEffect(() => {
      fetch("/api/v1/user/validate", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies.apiKey,
        },
      }).then((resp) => {
        if (resp.status === 200) {
          resp.json().then((data) => {
            actions.setUser(data);
          });
        } else {
          removeCookie("auth");
        }
      });
    }, [actions, cookies.apiKey, removeCookie]);
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <Body />
      </div>
    </Router>
  );
};
