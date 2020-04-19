import * as React from "react";
import { useHistory } from "react-router-dom";
import { useGlobal, State, Actions } from "../../state";

const styles = require("./styles.css");

export default (props) => {
  const [state, _] = useGlobal<State, Actions>();

  let history = useHistory();

  const toKebab = (text: string) => {
    return text.toLocaleLowerCase().replace(/ /g, "-");
  };
  const handleClick = (page) => {
    history.push(toKebab(page));
  };

  const loginOrActivities = state.currentUser ? "MY ACTIVITIES" : "LOGIN";

  const menuItems = ["PLANS", "MY PLAN", "PROPOSE NEW PLAN", loginOrActivities];

  return (
    <div className={styles.sidebar}>
      {menuItems.map((menuItem) => (
        <div
          className={styles.menuItem}
          key={menuItem}
          style={{ font: "bold 2em" }}
          onClick={() => handleClick(menuItem)}
        >
          {menuItem}
        </div>
      ))}
    </div>
  );
};
