import React from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import Squeal from "./Squeal";

import "../css/App.css";

function Post() {
  const { userGlobal, setUserGlobal } = useUserContext();

  const navigate = useNavigate();
  if (userGlobal.username === undefined || userGlobal.username === "") {
    //GET WHO AM I--------------------------------------------------------------------------------
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Tutto ok, io sono:", data);
        const updated = {
          ...userGlobal,
          username: data.username,
        };
        setUserGlobal(updated);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
