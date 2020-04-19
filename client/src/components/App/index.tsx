import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Body } from "../Body";
import Header from "../Header";
import Sidebar from "../Sidebar";

require("./styles.scss");

export default props => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Sidebar />
        <Body />
      </div>
    </Router>
  );
};
