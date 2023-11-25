import React from "react";
//userGlobal.usernameimport { useLocation } from "react-router-dom";

import Squeal from "./Squeal";
import Reactions from "./Reactions";
import Comment from "./Comment";

import { useNavigate } from "react-router-dom";

import { useUserContext } from "../config/UserContext";

import "../css/App.css";

function Post() {
  const { userGlobal } = useUserContext();

  const navigate = useNavigate();
  if (userGlobal.username === undefined) {
    navigate("/");
  }
  console.log(userGlobal.username);
  return (
    <>
      <div className="mt-5 ">
        <Squeal />
        <Reactions />
        <Comment />
      </div>
      <div className="row d-flex justify-content-center ms-1 me-1 mb-5">
        <h3>TODO:</h3>
        <ul className="list-group col-md-4">
          <li className="list-group-item list">popolarità</li>
          <li className="list-group-item list">GET past squeals</li>
          <li className="list-group-item list">PUT squeal</li>
          <li className="list-group-item list">
            PATCH squeal, per le reacctions
          </li>
          <li className="list-group-item list">LIVE QUOTA</li>
        </ul>
      </div>
    </>
  );
}

export default Post;
