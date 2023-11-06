import React from "react";

import Squeal from "./Squeal";
import Reactions from "./Reactions";
import Comment from "./Comment";

import "../css/App.css"

function Post() {

  return (
    <div className="mt-5 ">
      <Squeal />
      <Reactions />
      <Comment />
    </div>
  );
}

export default Post;
