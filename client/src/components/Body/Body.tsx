import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Calendar from "./Calendar";
import Plans from "./Plans";
import UserActivities from "./UserActivities";
import Login from "./Login";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export default (props) => {
  const [state, _] = useGlobal<State, Actions>();
  console.log(state);

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
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <div>hey body</div>
        </Route>
      </Switch>
    </div>
  );
};
