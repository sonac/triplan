import * as React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGlobal, State, Actions } from "../../state";
import { Body } from "../Body";
import Header from "../Header";

require("./styles.scss");

export default (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const [_, actions] = useGlobal<State, Actions>();

  if (cookies) {
    useEffect(() => {
      fetch("/api/v1/user", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies.apiKey,
        },
      })
        .then((resp) => {
          if (resp.status === 200) {
            resp.json().then((data) => {
              actions.setUser(data);
            });
          } else {
            removeCookie("auth");
          }
        })
        .catch((err) => console.error(err));
    }, []);
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
