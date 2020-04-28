import * as React from "react";
import { useState, useCallback } from "react";
import { Switch, Route } from "react-router-dom";
import * as Modal from "react-modal";
import { useCookies } from "react-cookie";
import Calendar from "./Calendar";
import Plans from "./Plans";
import UserActivities from "./UserActivities";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

interface AuthInput {
  email: string;
  password: string;
}

const customStyles = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "50em",
    height: "30em",
    backgroundColor: "#cc8c78",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

export default (_) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [authInput, setAuth] = useState({ email: "", password: "" });
  const [isSendding, setIsSending] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);

  const sendAuth = useCallback(
    async (authType: string, authInput: AuthInput) => {
      const authEndpoint = authType === "Sign Up" ? "register" : "login";
      if (isSendding) return;
      setIsSending(true);
      await fetch(`/api/v1/user/${authEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(authInput),
      })
        .then((resp) =>
          resp.json().then((d) => {
            actions.authModalSwitch(null);
            setCookie("apiKey", d.apiKey);
          })
        )
        .catch((err) => console.error(err));
      setIsSending(false);
    },
    [isSendding]
  );

  const handleChange = (e, inp) => {
    if (inp === "email") setAuth({ ...authInput, email: e.target.value });
    if (inp === "password") setAuth({ ...authInput, password: e.target.value });
  };

  return (
    <div className="body">
      <Switch>
        <Route path="/my-plan">
          <Calendar />
        </Route>
        <Route path="/plans">
          <Plans />
        </Route>
        <Route path="/my-activities">
          <UserActivities />
        </Route>
        <Route path="/">
          <div>hey body</div>
        </Route>
      </Switch>
      <Modal
        isOpen={state.authModal !== null}
        onRequestClose={() => actions.authModalSwitch(null)}
        style={customStyles}
        contentLabel="Auth"
      >
        <h2 className="modalHeader">{state.authModal}</h2>
        <p className="valid">Valid. Please wait</p>
        <p className="error">Error. Please fix your inputs</p>
        <input placeholder="Email" type="text" id="username" onChange={(e) => handleChange(e, "email")}></input>
        <input
          placeholder="Password"
          type="password"
          id="password"
          onChange={(e) => handleChange(e, "password")}
        ></input>
        <button id="submit" onClick={() => sendAuth(state.authModal, authInput)}>
          Login
        </button>
      </Modal>
    </div>
  );
};
