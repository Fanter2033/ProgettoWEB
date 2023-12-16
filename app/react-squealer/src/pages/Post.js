import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import Squeal from "./Squeal";

import "../css/App.css";

function Post() {

  //console.log(userGlobal.username);

  return (
    <>
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
