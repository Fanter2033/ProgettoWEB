import React from "react";
import { useState } from "react";
import ReactConfig from "../config/ReactConfig";

import "../css/App.css";

function Reactions({ squeal }) {
  const [loveMe, setLove] = useState(0);
  const [likeMe, setLike] = useState(0);
  const [doNotLikeMe, setDoNotLike] = useState(0);
  const [hateMe, setHate] = useState(0);

  function love() {
    //setLove(loveMe + 1);
    reactionEffect("LIKE_A_LOT");
  }
  function like() {
    //setLike(likeMe + 1);
    reactionEffect("LIKE");
  }
  function doNotLike() {
    //setDoNotLike(doNotLikeMe + 1);
    reactionEffect("DO_NOT_LIKE");
  }
  function hate() {
    //setHate(hateMe + 1);
    reactionEffect("DISGUSTED");
  }

  //!da togliere
  function reset() {
    setLove(0);
    setLike(0);
    setDoNotLike(0);
    setHate(0);
  }
  /*
<button className="yellow-button" onClick={reset}>
        RESET REAZIONI
      </button>
  */

  //PATCH /squeal/{itentifier_id}/rections/{reaction}
  async function reactionEffect(reactionType) {
    const uri = `${ReactConfig.base_url_requests}/squeal/${squeal}/reaction/${reactionType}`;

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("Reaction riuscita con successo");
        } else {
          console.error("Reaction fallito", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

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

        <button
          id="bottone2"
          className=" my-blu  bottoni_omologati m-1"
          onClick={like}
        >
          🙂
        </button>

        <button
          id="bottone4"
          className="my-blu bottoni_omologati m-1"
          onClick={doNotLike}
        >
          ☹️
        </button>
        <button
          id="bottone5"
          className="my-blu bottoni_omologati m-1"
          onClick={hate}
        >
          😡
        </button>
      </div>
    </div>
  );
}

export default Reactions;
