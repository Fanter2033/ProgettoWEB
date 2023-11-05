import React from "react";
import "../css/App.css";

function Reactions() {
  return (
    <div className="mt-1">
      <div className="card-footer d-flex justify-content-center">
        <button id="bottone1" className=" my-blu  bottoni_omologati m-1">
          😍
        </button>
        <button id="bottone2" className=" my-blu  bottoni_omologati m-1">
          🙂
        </button>
        <button id="bottone3" className="my-blu  bottoni_omologati m-1">
          😑
        </button>
        <button id="bottone4" className="my-blu bottoni_omologati m-1">
          ☹️
        </button>
        <button id="bottone5" className="my-blu bottoni_omologati m-1">
          😡
        </button>
      </div>
    </div>
  );
}

export default Reactions;
