import React from "react";
import { useEffect, useState } from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import CurrentDateTime from "./CurrentDateTime";
import Dest from "./Dest";
import LegendaDest from "./LegendaDest";
import MapComponent from "./MapComponent";

import "../css/App.css";
import cat from "./media/miau.png";

//offset mi tenere centrata la colonna

function Squeal() {
  const { userGlobal } = useUserContext();
  console.log(userGlobal);

  //DEST INPUT-----------------------------------------------------------------------------------
  const [destinatariFromDest, setDestinatariFromDest] = useState([]);
  const handleDestinatariSubmit = (destinatariArray) => {
    console.log(
      "Destinatari ricevuti nella componente padre:",
      destinatariArray
    );
    setDestinatariFromDest(destinatariArray);
  };

  //VALUE INPUT-----------------------------------------------------------------------------------
  //message_value depends on input_type
  const [userInput, setUserInput] = useState("");
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  //TYPE INPUT--------------------------------------------------------------
  //inputType = MESSAGE_TEXT, IMAGE_URL, VIDEO_URL, POSITION
  const [inputType, setInputType] = useState("");
  let inputElement = null;

  if (inputType === "MESSAGE_TEXT") {
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
  } else if (inputType === "IMAGE_URL") {
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
  } else if (inputType === "VIDEO_URL") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="imageInput" className="form-label">
          Carica un video:
        </label>
        <input
          type="file"
          id="videoInput"
          name="videoInput"
          accept="video/*"
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    );
  } else if (inputType === "POSITION") {
    inputElement = (
      <div className="mb-3">
        <p>Geolocalizzazione</p>
        <p>API:Leaflet</p>
        <MapComponent />
      </div>
    );
  }

  //TODO POST SQUEAL /squeal/------------------------------------------------------------------------------------------------------------
  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  async function postSqueal() {
    //TODO: manca body fetch
    /*
    squeal:{
      destinations
      § CHANNEL, # CHANNEL_TAG, @ USER
        dest_type:§ CHANNEL (CHANNEL_OFFICIAL/ CHANNEL_USERS)
                  # CHANNEL_TAG
                  @ USER
        identifier: string
      message_type: MESSAGE_TEXT || IMAGE_URL || VIDEO_URL || POSITION 
      content: txt || img || link || map(img)
    }
    */
    const data = {
      squeal: {
        //lista di oggetti
        destinations: destinatariFromDest,
        sender: userGlobal.username,
        message_type: inputType,
        //message_value o content?
        message_value: userInput,
      },
    };

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

  //!squeal
  //TODO PUT SQUEAL /squeal/{identifier_id} ------------------------------------------------------------------------------------------------------------
  //TODO DELETE SQUEAL /squeal/{identifier_id} ------------------------------------------------------------------------------------------------------------

  //TODO GET SQUEAL /squeal/   -------------logger dei vecchi squeal------------------------------------------------------------------------------------------------------------
  //! mi serve l'id?
  /*
  const [squeal, setSqueal] = useState([]);

  async function getSqueals() {
    try {
      const uri = `${ReactConfig.base_url_requests}/squeal/`;
      let result = await fetch(uri);

      if (result.ok) {
        let json = await result.json();
        console.log(json);
        let camp = json.channels;
        setSqueal(camp);
        return camp;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log(squeal);

  //const channelsArray = Object.values(channels.channels);
  //console.log(channelsArray);

  useEffect(() => {
    const intervalId = setInterval(getSqueals, 5000);
    return () => {
      clearInterval(intervalId);
    };
  });
*/

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
              <Dest onDestinatariSubmit={handleDestinatariSubmit} />
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
                  className={`green-button ${
                    inputType === "MESSAGE_TEXT"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setInputType("MESSAGE_TEXT")}
                >
                  Testo
                </button>

                <button
                  type="button"
                  className={`green-button ${
                    inputType === "IMAGE_URL" ? "active" : ""
                  }`}
                  onClick={() => setInputType("IMAGE_URL")}
                >
                  Immagine
                </button>

                <button
                  type="button"
                  className={`green-button ${
                    inputType === "VIDEO_URL" ? "active" : ""
                  }`}
                  onClick={() => setInputType("VIDEO_URL")}
                >
                  Video
                </button>

                <button
                  type="button"
                  className={`green-button ${
                    inputType === "POSITION" ? "active" : ""
                  }`}
                  onClick={() => setInputType("POSITION")}
                >
                  Geo
                </button>
              </div>
            </div>

            <div className="card-text mb-3">
              <form>{inputElement}</form>
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
                <h5 className="mt-0">{userGlobal.username}</h5>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Squeal;
