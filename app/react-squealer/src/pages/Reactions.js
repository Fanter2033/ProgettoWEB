import React from "react";
import "../App.css";

function Reactions() {
  return (
    <div class="mt-1">
      <div class="card-footer d-flex justify-content-center">
        <button id="bottone1" class=" my-blu  bottoni_omologati m-1">
          😍
        </button>
        <button id="bottone2" class=" my-blu  bottoni_omologati m-1">
          🙂
        </button>
        <button id="bottone3" class="my-blu  bottoni_omologati m-1">
          😑
        </button>
        <button id="bottone4" class="my-blu bottoni_omologati m-1">
          ☹️
        </button>
        <button id="bottone5" class="my-blu bottoni_omologati m-1">
          😡
        </button>
      </div>
    </div>
  );
}

export default Reactions;
