import * as React from "react";
import { useHistory } from "react-router-dom";
import { useGlobal, State, Actions } from "../../state";

require("./styles.scss");

export default (props) => {
  const [state, actions] = useGlobal<State, Actions>();

  let history = useHistory();

  const toKebab = (text: string) => {
    return text.toLocaleLowerCase().replace(/ /g, "-");
  };
  const handleClick = (page) => {
    actions.changePage(page);
    history.push(toKebab(page));
  };

  const menuItems = ["PLANS", "MY PLAN", "PROPOSE NEW PLAN", "MY ACTIVITIES"];

  return (
    <div className="sidebar">
      {menuItems.map((menuItem) => (
        <div className="menuItem" key={menuItem} style={{ font: "bold 2em" }} onClick={() => handleClick(menuItem)}>
          {menuItem}
        </div>
      ))}
    </div>
  );
};
