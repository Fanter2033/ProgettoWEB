import React from "react";
import "../css/App.css";

function Reactions() {
  function love() {}
  function like() {}
  function doNotLike() {}
  function hate() {}

  //TODO: implement ON CLICK
  /*
  <button id="bottone3" className="my-blu  bottoni_omologati m-1" onCLik={boh}>
          😑
  </button> 
  */
  return (
    <div className="mt-2">
      <div className="card-footer d-flex justify-content-center ">
        <button
          id="bottone1"
          className=" my-blu  bottoni_omologati m-1"
          onCLik={love}
        >
          😍
        </button>
        <button
          id="bottone2"
          className=" my-blu  bottoni_omologati m-1"
          onCLik={like}
        >
          🙂
        </button>
        <button
          id="bottone4"
          className="my-blu bottoni_omologati m-1"
          onCLik={doNotLike}
        >
          ☹️
        </button>
        <button
          id="bottone5"
          className="my-blu bottoni_omologati m-1"
          onCLik={hate}
        >
          😡
        </button>
      </div>
    </div>
  );
}

export default Reactions;
