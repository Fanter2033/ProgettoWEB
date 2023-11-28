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
          <li className="list-group-item list">
            MAPPE A TEMPO: ogni mappa 125, user mette num rep e num tempo
          </li>

          <li className="list-group-item list">
            PUT squeal mappe temporizzare
          </li>
          <li className="list-group-item list">
            POST squeal mappe temporizzare
          </li>
          <li className="list-group-item list">
            POST squeal mappe, CORS STRONZO
          </li>
          <li className="list-group-item list">LIVE QUOTA: temporizzati</li>
          <li className="list-group-item list">PROBLEMA SFONDO?</li>
        </ul>
      </div>
    </>
  );
}

export default Post;
