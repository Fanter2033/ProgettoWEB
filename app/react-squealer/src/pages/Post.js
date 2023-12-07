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
  //console.log(userGlobal.username);

  return (
    <>
      <div className="row d-flex justify-content-center ms-1 me-5">
        <h3>TODO:</h3>
        <ul className="list-group col-md-4">
          <li className="list-group-item list">
            PUT squeal mappe temporizzare
          </li>
          <li className="list-group-item list">
            POST squeal mappe temporizzare
          </li>
          <li className="list-group-item list">
            LIVE QUOTA: mappe temporizzate
          </li>
          <li className="list-group-item list">
            LIVE QUOTA: text temporizzati
          </li>
        </ul>
      </div>
      <div className="container-flex pt-5 pb-5">
        <h1 className="cool-font">CONDIVIDI</h1>
        <div className="">
          <Squeal />
        </div>
      </div>
    </>
  );
}

export default Post;
