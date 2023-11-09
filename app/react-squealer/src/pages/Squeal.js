import React from "react";
import { useEffect, useState } from "react";
import ReactConfig from "../config/ReactConfig";

import CurrentDateTime from "./CurrentDateTime";
import Dest from "./Dest";
import LegendaDest from "./LegendaDest";
import MapComponent from "./MapComponent";

import "../css/App.css";
//import pinguini from "./media/744677.jpg";
import cat from "./media/miau.png";

//offset mi tenere centrata la colonna

function Squeal(props) {
  console.log(props);

  //TODO POST SQUEAL /squeal/------------------------------------------------------------------------------------------------------------
  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  async function postSqueal() {
    //TODO: manca body fetch
    const data = {};
    const uri = `${ReactConfig.base_url_requests}/squeal/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("POST Squeal riuscita con successo");
        } else {
          console.error("Errore durante la POST, riprova", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  useEffect(() => {
    if (fetchDataFlag) {
      postSqueal();
      setFetchDataFlag(false);
    }
  }, [fetchDataFlag]);

  const handleClickButton = () => {
    setFetchDataFlag(true); // Attiva useEffect quando clicchi sul pulsante
  };

  //TODO PUT SQUEAL /squeal/{identifier_id} ------------------------------------------------------------------------------------------------------------

  //TODO DELETE SQUEAL /squeal/{identifier_id} ------------------------------------------------------------------------------------------------------------

  //USER INPUT-----------------------------------------------------------------------------------

  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  //--------------------------------------------------------------
  const [inputType, setInputType] = useState("text");

  let inputElement = null;

  if (inputType === "text") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="userInput" className="form-label">
          Testo
        </label>
        <textarea
          id="userInput"
          name="userInput"
          value={userInput}
          onChange={handleInputChange}
          rows="4"
          cols="50"
          className="form-control"
        ></textarea>
      </div>
    );
  } else if (inputType === "image") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="imageInput" className="form-label">
          Carica un'immagine:
        </label>
        <input
          type="file"
          id="imageInput"
          name="imageInput"
          accept="image/*"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    );
  } else if (inputType === "video") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="imageInput" className="form-label">
          Carica un video:
        </label>
        <input
          type="file"
          id="imageInput"
          name="imageInput"
          accept="image/*"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    );
  } else if (inputType === "location") {
    inputElement = (
      <div className="mb-3">
        <p>Geolocalizzazione: Aggiungi la geolocalizzazione dell'utente qui.</p>
        <p>API:Mapbox o Leaflet</p>
        <MapComponent/>
      </div>
    );
  }

  //-------------------------------------------------------------------
  return (
    <div>
      <div className="container col-12 col-md-6 offset-md-3 ">
        <div className="card d-felx box">
          <div className="card-header col-12">
            <div className="media-head "></div>
            <div className="media-body">
              <CurrentDateTime />
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <Dest />
            </div>
            <div className="mb-3 mt-5">
              <label className="me-3 mb-2" htmlFor="inputType">
                Tipo input
              </label>

              <div
                className="btn-group"
                role="group"
                aria-label="Tipo di Input"
              >
                <button
                  type="button"
                  className={`btn ${
                    inputType === "text" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setInputType("text")}
                >
                  Testo
                </button>
                <button
                  type="button"
                  className={`btn ${
                    inputType === "image" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setInputType("image")}
                >
                  Immagine
                </button>
                <button
                  type="button"
                  className={`btn ${
                    inputType === "video" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setInputType("video")}
                >
                  Video
                </button>
                <button
                  type="button"
                  className={`btn ${
                    inputType === "location" ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => setInputType("location")}
                >
                  Geo
                </button>
              </div>
            </div>

            <div className="">
              <div className="card-text mb-3">
                <form>{inputElement}</form>
              </div>
            </div>

            <div className="row d-flex flex-row justify-content-evenly align-items-center">
              <div className="col-9">
                <button
                  className="custom-button"
                  style={{ width: "80%" }}
                  onClick={handleClickButton}
                >
                  SQUEAL
                </button>
              </div>
              <div className="col-3">
                {" "}
                <img
                  src={cat}
                  className="rounded-circle"
                  alt="Immagine Profilo"
                  style={{ width: "40%" }}
                />
                <h5 className="mt-0">{props.username}</h5>
              </div>
            </div>
          </div>
        </div>
        <LegendaDest />
      </div>
    </div>
  );
}

export default Squeal;
