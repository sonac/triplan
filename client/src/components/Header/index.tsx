import * as React from "react";
import { useGlobal, State, Actions } from "../../state";

const styles = require("./styles.css");

export default props => {
  const [state, _] = useGlobal<State, Actions>();

  return (
    <div className={styles.header}>
      <div className={styles.current}>{state.page}</div>
    </div>
  );
};
