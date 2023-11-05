import React from "react";
import "../css/App.css";
import pinguini from "./media/744677.jpg";
import cat from "./media/miau.png";

//offset mi tenere centrata la colonna

function Squeal() {
  return (
    <div>
      <div className="container col-12 col-md-6 offset-md-3">
        <div className="card d-felx">
          <div className="card-header col-12">
            <div className="media-head ">
              <img
                src={cat}
                className="rounded-circle"
                alt="Immagine Profilo"
                style={{ width: "20%" }}
              />
            </div>
            <div className="media-body">
              <h5 className="mt-0">Big Feet</h5>
            </div>
          </div>

          <img
            src={pinguini}
            className="card-img-top"
            alt="Immagine del Post"
          />

          <div className="card-body">
            <p className="card-text">corpo dello squeal</p>
            <p>Data e Ora del Post</p>
            <button className="custom-button">SQUEAL</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Squeal;
