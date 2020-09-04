import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import * as Modal from "react-modal";
import { useCookies } from "react-cookie";
import Calendar from "./Calendar";
import Plans from "./AllPlans";
import UserActivities from "./UserActivities";
import { useGlobal, State, Actions } from "../../state";
import Plan from "./Plan";
import "./styles.scss";

interface AuthInput {
  email: string;
  password: string;
}

export const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    width: "30%",
    height: "30vw",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1e202c",
    fontFamily: "Roboto Mono",
    color: "white",
    border: 0,
    boxShadow: "inset 4px 4px 12px #3A3F5E, inset -4px -4px 12px #000000",
    borderRadius: "2em",
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const isValidEmail = (email: string): boolean => {
  const emailRegex: RegExp = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

const isStrongPassword = (password: string): string => {
  const digits = /\d/;
  const capitals = /[A-Z]\B/;
  if (!digits.test(password)) {
    return "Passowrd must contain at least one digit";
  }
  if (!capitals.test(password)) {
    return "Passowrd must contain at least one capitals letter";
  }
  return "Valid";
};

export default (_) => {
  const [state, actions] = useGlobal<State, Actions>();
  const [authInput, setAuth] = useState({ email: "", password: "" });
  const [isSendding, setIsSending] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const [errMessage, setErrMessage] = useState("");
  const location = useLocation();

  if (location.pathname.includes("exchange-token")) {
    const p: string = location.search;
    const tokenString = p.substring(
      p.lastIndexOf("code=") + 5,
      p.lastIndexOf("&scope")
    );
    useEffect(() => {
      fetch("/api/v1/user/strava-access-code", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + cookies.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: tokenString }),
      }).then((res) => {
        window.location.href = "/my-activities";
      });
    });
  }

  const sendAuth = useCallback(
    async (authType: string, authInp: AuthInput) => {
      const authEndpoint = authType === "SIGN UP" ? "register" : "login";
      setErrMessage("");
      if (!isValidEmail(authInp.email)) {
        setErrMessage("Email address is invalid");
        return;
      }
      const passwordValidation: string = isStrongPassword(authInp.password);

      if (passwordValidation !== "Valid") {
        setErrMessage(passwordValidation);
        return;
      }
      if (isSendding) return;
      setIsSending(true);
      await fetch(`/api/v1/user/${authEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(authInp),
      })
        .then((resp) => {
          resp.json().then((d) => {
            actions.authModalSwitch(null);
            removeCookie("apiKey");
            setCookie("apiKey", d.apiKey, { path: "/", sameSite: true });
            window.location.href = "/my-activities";
          });
        })
        .catch((err) => {
          throw new Error(err);
        });
      setIsSending(false);
    },
    [
      isSendding,
      actions,
      removeCookie,
      setCookie,
      isValidEmail,
      isStrongPassword,
      setErrMessage,
      errMessage,
    ]
  );

  const handleChange = (e, inp) => {
    if (inp === "email") setAuth({ ...authInput, email: e.target.value });
    if (inp === "password") setAuth({ ...authInput, password: e.target.value });
  };

  // removing dim
  Modal.defaultStyles.overlay.backgroundColor = "rgba(0, 0, 0, 0)";

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
        <Route path="/plan/:planName" children={<Plan />} />
        <Route path="/">
          <div>hey body</div>
        </Route>
      </Switch>
      <Modal
        isOpen={state.activityModal !== null}
        onRequestClose={() => actions.activityModalSwitch(null)}
        style={customStyles}
      >
        <div className="activityModal">
          {state.activityModal ? state.activityModal.description : ""}
        </div>
      </Modal>
      <Modal
        isOpen={state.authModal !== null}
        onRequestClose={() => actions.authModalSwitch(null)}
        style={customStyles}
        backdropOpacity={0}
        contentLabel="Auth"
      >
        <div className="modalContent">
          <p className="valid" style={{ display: "none" }}>
            Valid. Please wait
          </p>
          <p className="error" style={{ display: "none" }}>
            Error. Please fix your inputs
          </p>
          <div className="label">E-mail</div>
          <input
            type="text"
            id="username"
            onChange={(e) => handleChange(e, "email")}
          ></input>
          <div className="label">Password</div>
          <input
            type="password"
            id="password"
            onChange={(e) => handleChange(e, "password")}
          ></input>
          <div className="errorMessage">{errMessage}</div>
          <button
            id="submit"
            onClick={() => sendAuth(state.authModal, authInput)}
          >
            {state.authModal}
          </button>
        </div>
      </Modal>
    </div>
  );
};
