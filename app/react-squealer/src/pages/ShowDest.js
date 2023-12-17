import React from "react";

function ShowDest({ arrayDest }) {
  return (
    <div>
      {arrayDest.map((destination, index) => {
        return (
          <div className="ms-1 me-4 cool-font-details d-flex flex-row justify-content-start align-items-center" key={index}>
            <b> {destination} </b>
          </div>
        );
      })}
    </div>
  );
}

export default ShowDest;
