import React from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../config/UserContext";

import Squeal from "./Squeal";

import "../css/App.css";

function Post() {
  const { userGlobal } = useUserContext();

  const navigate = useNavigate();
  if (userGlobal.username === undefined || userGlobal.username === "") {
    navigate("./");
  }
  console.log(userGlobal.username);

  return (
    <>
      <div className="mt-5 ">
        <Squeal />
      </div>
      <div className="row d-flex justify-content-center ms-1 me-1 mb-5">
        <h3>TODO:</h3>
        <ul className="list-group col-md-4">
          <li className="list-group-item list">GET past squeals</li>
          <li className="list-group-item list">PUT squeal</li>
          <li className="list-group-item list">DELETE squeal</li>
          <li className="list-group-item list">test mappe</li>
          <li className="list-group-item list">test temporizzati</li>
          <li className="list-group-item list">test img</li>
          <li className="list-group-item list">utente esiste????</li>
          <li className="list-group-item list">MAPPE A TEMPO?</li>
          <li className="list-group-item list">PROBLEMA SFONDO?</li>
        </ul>
      </div>
    </>
  );
}

export default Post;
