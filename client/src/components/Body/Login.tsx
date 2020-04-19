import * as React from "react";
import { useState, useEffect } from "react";

interface UserLogin {
  username: string;
  password: string;
}

export default (props) => {
  const [user, setUser] = useState({ username: "", password: "" });

  const handleChange = (e, inp) => {
    if (inp === "username") setUser({ ...user, username: e.target.value });
    if (inp === "password") setUser({ ...user, password: e.target.value });
  };

  console.log(user);

  return (
    <div className="login">
      <input
        type="text"
        placeholder="username"
        onChange={(e) => handleChange(e, "username")}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => handleChange(e, "password")}
      />
      <div className="loginButton">Login</div>
    </div>
  );
};
