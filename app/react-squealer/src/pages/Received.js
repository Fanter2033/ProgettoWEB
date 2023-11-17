import React from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import "../css/App.css";

function Received() {
  const { userGlobal } = useUserContext();
  const navigate = useNavigate();
  if (userGlobal.username === undefined) {
    navigate("/");
  }

  return (
    <>
      <Navbar />
      <div className="cool-font">Received Squeals</div>
      <div className="cool-font-small">Followed channels</div>
      <div className="cool-font-small">Public Squeals</div>
      <div className="cool-font-small"></div>
    </>
  );
}

export default Received;
