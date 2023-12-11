import React from "react";
import { Link } from "react-router-dom";
import TextLink from "./TextLink";

function ShowDest({ arrayDest }) {
  return (
    <div>
      {arrayDest.map((destination, index) => {
        const cleanedDestination = destination.substring(1);
        return (
          <div className="ms-4 me-4 cool-font-details d-flex flex-row justify-content-start align-items-center" key={index}>
            <b> {destination} </b>
          </div>
        );
      })}
    </div>
  );
}

export default ShowDest;
