import * as React from "react";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();

  return (
    <div className="header">
      <div className="current">{state.page}</div>
      {state.user ? (
        <div>Hello, {state.user.email}</div>
      ) : (
        <div className="authBlock">
          <div className="signUpButton" onClick={() => actions.authModalSwitch("Sign Up")}>
            SIGN UP
          </div>
          <div className="loginButton" onClick={() => actions.authModalSwitch("Login To Your Account")}>
            LOGIN
          </div>
        </div>
      )}
    </div>
  );
};
