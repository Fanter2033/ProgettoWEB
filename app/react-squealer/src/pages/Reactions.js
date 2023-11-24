import React from "react";
import { useState } from "react";
import "../css/App.css";

function Reactions() {
  const [loveMe, setLove] = useState(0);
  const [likeMe, setLike] = useState(0);
  const [doNotLikeMe, setDoNotLike] = useState(0);
  const [hateMe, setHate] = useState(0);

  function love() {
    setLove(loveMe + 1);
  }
  function like() {
    setLike(likeMe + 1);
  }
  function doNotLike() {
    setDoNotLike(doNotLikeMe + 1);
  }
  function hate() {
    setHate(hateMe + 1);
  }

  //!da togliere
  function reset() {
    setLove(0);
    setLike(0);
    setDoNotLike(0);
    setHate(0);
  }

  
  //TODO: implement ON CLIK PATCH /squeal/{itentifier_id}/rections/{reaction}
  return (
    <div className="mt-2">
      <div className="card-footer d-flex justify-content-center ">
        <button
          id="bottone1"
          className=" my-blu  bottoni_omologati m-1"
          onClick={love}
        >
          😍
        </button>
        {loveMe}
        <button
          id="bottone2"
          className=" my-blu  bottoni_omologati m-1"
          onClick={like}
        >
          🙂
        </button>
        {likeMe}
        <button
          id="bottone4"
          className="my-blu bottoni_omologati m-1"
          onClick={doNotLike}
        >
          ☹️
        </button>
        {doNotLikeMe}
        <button
          id="bottone5"
          className="my-blu bottoni_omologati m-1"
          onClick={hate}
        >
          😡
        </button>
        {hateMe}
      </div>
      <button className="user_button" onClick={reset}>
        RESET REAZIONI
      </button>
    </div>
  );
}

export default Reactions;
