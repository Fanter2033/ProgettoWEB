import React from "react";
//userGlobal.usernameimport { useLocation } from "react-router-dom";


import Squeal from "./Squeal";
import Reactions from "./Reactions";
import Comment from "./Comment";

import { useUserContext } from "../config/UserContext";


import "../css/App.css";

function Post() {
  const { userGlobal, setUserGlobal } = useUserContext();

  console.log(userGlobal.username);
  return (
<>

<div className="mt-5 ">
      <Squeal username={userGlobal.username}/>
      <Reactions />
      <Comment />
    </div>
</>
   
  );
}

export default Post;
