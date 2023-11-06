import React from "react";
import { useLocation } from "react-router-dom";

import Squeal from "./Squeal";
import Reactions from "./Reactions";
import Comment from "./Comment";

import "../css/App.css";

function Post() {
  const location = useLocation();
  const { username } = location.state;

  console.log(username);
  return (

    <div className="mt-5 ">
      <Squeal username={username}/>
      <Reactions />
      <Comment />
    </div>
  );
}

export default Post;
