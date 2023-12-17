import React from "react";

import Squeal from "./Squeal";

import "../css/App.css";

function Post() {
  return (
    <>
      <div className="container-flex pt-2 pb-5">
        <div className="row">
          <h1 className="cool-font">CONDIVIDI</h1>
          <Squeal />
        </div>
      </div>
    </>
  );
}

export default Post;
