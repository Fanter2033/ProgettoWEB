import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import CurrentDateTime from "./CurrentDateTime";
import Dest from "./Dest";
import MapComponent from "./MapComponent";
//import MapWithSearch from "./MapWithSearch";
import TextLink from "./TextLink";

import imageCompression from "browser-image-compression";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import cat from "./media/miau.png";
/*
l'aggiunta di flex-wrap consente agli elementi figlio 
di andare a capo su più righe se lo spazio orizzontale è limitato. 
*/
//offset mi tenere centrata la colonna

//TODO PUT SQUEAL /squeal/{identifier_id}  SOLO mappeeeeeeeee------------------------------------------------------------------------------------------------------------
function Squeal() {
  const { userGlobal } = useUserContext();

  const navigate = useNavigate();
  if (userGlobal.username === undefined || userGlobal.username === "") {
    navigate("./");
  }

  const notify = () =>
    toast.error("Manca desinatario. Riprovare", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notify2 = () =>
    toast.error("Manca il contenuto? L'utente esiste?", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notify3 = () =>
    toast.error("Riempi tutti i campi", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  //GET QUOTE-----------------------------------------------------------------------------------------------
  const [userQuote, setUserQuote] = useState("");

  async function getUserQuote() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/quote`;

      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let quote = await result.json();
        console.log(quote);
        setUserQuote(quote);
        return quote;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //LIVE QUOTA-----------------------------------------------------------------------------------
  const liveDay = userQuote.remaining_daily;
  const liveWeek = userQuote.remaining_weekly;
  const liveMonth = userQuote.remaining_monthly;

  const [newDay, setNewDay] = useState(0);
  const [newWeek, setNewWeek] = useState(0);
  const [newMonth, setNewMonth] = useState(0);

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
    const inputText = e.target.value;
    //<TextLink text={inputText} />;

    const inputLength = inputText.length;

    // quota rimanente dopo il post
    const remainingLimitD = liveDay - inputLength;
    const remainingLimitW = liveWeek - inputLength;
    const remainingLimitM = liveMonth - inputLength;

    setUserInput(inputText);
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
  };

  //IMAGE-----------------------------------------------------------------------------------
  const [base64Image, setBase64Image] = useState("");

  const handleImageUpload = useCallback(async (e) => {
    const imageFile = e.target.files[0];

    const remainingLimitD = liveDay - 125;
    const remainingLimitW = liveWeek - 125;
    const remainingLimitM = liveMonth - 125;
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
    try {
      // compressione
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageFile, options);

      // conversione in Base64
      const compressedBase64 = await getBase64(compressedFile);
      setBase64Image(compressedBase64);
    } catch (error) {
      console.error("Errore durante la gestione dell'immagine:", error);
    }
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  //VIDEO_URL TYPE-----------------------------------------------------------------------------------
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isValidLink, setIsValidLink] = useState(true);

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    const linkLength = link.length;

    const remainingLimitD = liveDay - linkLength;
    const remainingLimitW = liveWeek - linkLength;
    const remainingLimitM = liveMonth - linkLength;
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);

    setYoutubeLink(link);
    setUserInput(link);

    // validazione del link
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|user\/|c\/)?[a-zA-Z0-9_-]{1,})|(youtu\.be\/[a-zA-Z0-9_-]{1,})/;
    setIsValidLink(regex.test(link));
  };

  //POSITION -------------------------------------------------------------------------------------------
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const handleMarkerAdded = (position) => {
    setMarkerCoordinates(position);
    const remainingLimitD = liveDay - 125;
    const remainingLimitW = liveWeek - 125;
    const remainingLimitM = liveMonth - 125;
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
    //console.log("Coordinate utente:", position);
  };
  //<MapWithSearch onMarkerAdded={handleMarkerAdded} />

  //TEXT_AUTO domande per utente--------------------------------------------------------------
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const handleNumero1Change = (e) => {
    setNumero1(e.target.value);
  };

  const handleNumero2Change = (e) => {
    setNumero2(e.target.value);
  };

  //TEXT_AUTO bottoni ------------------------------------
  const [postText, setPostText] = useState("");
  const [clickedButtons, setClickedButtons] = useState([]);

  const handleButtonClick = (buttonText) => {
    // aggiungi il testo del bottone cliccato al testo del post
    setPostText((prevText) => prevText + buttonText);

    // aggiungi il testo del bottone alla lista dei bottoni cliccati
    setClickedButtons((prevButtons) => [...prevButtons, buttonText]);
  };

  //TYPE INPUT--------------------------------------------------------------
  //inputType = MESSAGE_TEXT, IMAGE, VIDEO_URL, POSITION, POSITION_AUTO
  const [inputType, setInputType] = useState("");
  let inputElement = null;

  if (inputType === "MESSAGE_TEXT") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="userInput" className="form-label">
          <b>Testo</b>
        </label>
        <textarea
          id="userInput"
          name="userInput"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Squeal time"
          rows="4"
          cols="50"
          className="form-control"
        />
      </div>
    );
  } else if (inputType === "IMAGE") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="imageInput" className="form-label">
          <b>Immagine</b>
        </label>
        <input
          type="file"
          id="imageInput"
          name="imageInput"
          accept="image/*"
          onChange={handleImageUpload}
          className="form-control"
        />
        {base64Image && <img src={base64Image} alt="Selected" />}
      </div>
    );
  } else if (inputType === "VIDEO_URL") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="youtubeLink" className="form-label">
          <b>Link YouTube</b>
        </label>
        <input
          type="text"
          id="youtubeLink"
          name="videoInput"
          value={youtubeLink}
          onChange={handleYoutubeLinkChange}
          className="form-control"
        />
        {!isValidLink && (
          <p style={{ color: "red" }}>Inserisci un link YouTube valido.</p>
        )}
      </div>
    );
  } else if (inputType === "POSITION") {
    inputElement = (
      <div className="mb-3">
        <b>Geolocalizzazione</b>
        <MapComponent onLocationChange={handleMarkerAdded} />
      </div>
    );
  } else if (inputType === "TEXT_AUTO") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="userInput" className="form-label">
          <b>Messaggio temporizzato</b>
          <div className="">
            <label htmlFor="numero1" className="me-2">
              Quante ripetizioni?
            </label>
            <input
              type="number"
              id="numero1"
              value={numero1}
              style={{ width: "20%" }}
              onChange={handleNumero1Change}
            />
          </div>
          <div className="">
            <label htmlFor="numero2" className="me-2">
              Ogni quanti secondi?
            </label>
            <input
              type="number"
              id="numero2"
              value={numero2}
              style={{ width: "20%" }}
              onChange={handleNumero2Change}
            />
          </div>
        </label>

        <textarea
          id="userInput"
          name="userInput"
          rows="4"
          cols="50"
          placeholder="Inserisci il testo del post..."
          value={postText}
          className="form-control"
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <div>
          <button
            type="button"
            className="custom-button"
            onClick={() => handleButtonClick("{NUMERO}")}
          >
            NUMERO
          </button>
          <button
            type="button"
            className="custom-button"
            onClick={() => handleButtonClick("{ORA}")}
          >
            ORA
          </button>
          <button
            type="button"
            className="custom-button"
            onClick={() => handleButtonClick("{MINUTO}")}
          >
            MINUTO
          </button>
          <button
            type="button"
            className="custom-button"
            onClick={() => handleButtonClick("{SECONDO}")}
          >
            SECONDO
          </button>
          <button
            type="button"
            className="custom-button"
            onClick={() => handleButtonClick("{DATA}")}
          >
            DATA
          </button>
        </div>
      </div>
    );
  } else if (inputType === "POSITION_AUTO") {
    inputElement = (
      <div className="mb-3">
        <b>Geolocalizzazione temporizzata</b>
      </div>
    );
  }

  //TODO POST SQUEAL /squeal/ MANCANO MAPPE E MAPPE TEMPORIZZATE------------------------------------------------------------------------------------------------------------
  const [fetchDataFlag, setFetchDataFlag] = useState(false);

  async function postSqueal(e) {
    e.preventDefault();
    /*
    squeal:{
      destinations
      § CHANNEL, # CHANNEL_TAG, @ USER
        dest_type:§ CHANNEL (CHANNEL_OFFICIAL/ CHANNEL_USERS)
                  # CHANNEL_TAG
                  @ USER
        identifier: string
      message_type: MESSAGE_TEXT || IMAGE || VIDEO_URL || POSITION || TEXT_AUTO || POSITION_AUTO
      content: txt || img || link || map(img)
    }
    */

    //console.log(destinatariFromDest);
    if (destinatariFromDest.length !== 0) {
      let data = {};
      if (inputType === "IMAGE") {
        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: userGlobal.username,
            message_type: inputType,
            content: base64Image,
          },
        };
      } else if (inputType === "POSITION") {
        const coordinates = markerCoordinates;
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb", coordinates);
        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: userGlobal.username,
            message_type: inputType,
            content: coordinates,
          },
        };

        console.log("aaaaaaaaaaaaaaaaaaaa", markerCoordinates);
      } else if (inputType === "TEXT_AUTO") {
        // Esegui le operazioni desiderate con il testo del post e i bottoni cliccati
        console.log("Testo del post:", postText);
        console.log("Bottoni cliccati:", clickedButtons);

        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: userGlobal.username,
            message_type: inputType,
            content: postText,
            auto_iterations: numero1,
            auto_seconds_delay: numero2,
          },
        };
        if (numero1 === "" || numero2 === "") {
          notify3();
        }
      } else {
        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: userGlobal.username,
            message_type: inputType,
            content: userInput,
          },
        };
      }

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

            navigate("./");
          } else {
            console.error(
              "Errore durante la POST, riprova",
              response.statusText
            );
            //console.log(response);
            notify2();
          }
        })
        .catch((error) => {
          console.error("Network error", error);
        });
    } else {
      notify();
    }

    /*
    TODO: THIS IS CALLED ONLY ON RESPONSE OK. HANDLE BE ERRORS
    setTimeout(() => {
      window.location.reload();
    }, 3000); // 3000 millisecondi = 3 secondi
     */
  }

  //GET LOG SQUEALS VECCHI--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function log() {
    try {
      const url = `${ReactConfig.base_url_requests}/utils/squeals/${userGlobal.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      let result = await fetch(url, options);

      if (result.ok) {
        let json = await result.json();
        setSquealsLogger(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(getUserQuote, 30000); //30 sec
    getUserQuote();

    log();

    console.log(newDay);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //-------------------------------------------------------------------
  return (
    <div>
      <div className="container col-12 col-md-6 offset-md-3 ">
        <div className="card squeal d-felx box">
          <div className="card-header squeal col-12">
            <div className="media-head "></div>
            <div className="media-body">
              <CurrentDateTime />
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <Dest onDestinatariSubmit={handleDestinatariSubmit} />
            </div>

            <div className="mb-3 mt-3">
              <div
                className="btn-group"
                role="group"
                aria-label="Tipo di Input"
              >
                <button
                  type="button"
                  className={`bottoni_omologati ${
                    inputType === "MESSAGE_TEXT" ? "active" : ""
                  }`}
                  onClick={() => setInputType("MESSAGE_TEXT")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                    alt="MESSAGE_TEXT"
                  >
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`bottoni_omologati ${
                    inputType === "IMAGE" ? "active" : ""
                  }`}
                  onClick={() => setInputType("IMAGE")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-card-image"
                    viewBox="0 0 16 16"
                    alt="IMAGE"
                  >
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`bottoni_omologati ${
                    inputType === "VIDEO_URL" ? "active" : ""
                  }`}
                  onClick={() => setInputType("VIDEO_URL")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-youtube"
                    viewBox="0 0 16 16"
                    alt="VIDEO_URL"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={` bottoni_omologati ${
                    inputType === "POSITION" ? "active" : ""
                  }`}
                  onClick={() => setInputType("POSITION")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-geo-alt"
                    viewBox="0 0 16 16"
                    alt="POSITION"
                  >
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`bottoni_omologati ${
                    inputType === "TEXT_AUTO" ? "active" : ""
                  }`}
                  onClick={() => setInputType("TEXT_AUTO")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clock-history"
                    viewBox="0 0 16 16"
                    alt="TEXT_AUTO"
                  >
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`bottoni_omologati ${
                    inputType === "POSITION_AUTO" ? "active" : ""
                  }`}
                  onClick={() => setInputType("POSITION_AUTO")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-geo-fill"
                    viewBox="0 0 16 16"
                    alt="POSITION_AUTO"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="card-text mb-3">
              <form>{inputElement}</form>
            </div>

            <div className="row d-flex flex-row justify-content-evenly align-items-center">
              <div className="col-8">
                <button
                  className="custom-button"
                  style={{ width: "80%" }}
                  onClick={postSqueal}
                >
                  SQUEAL
                </button>
                <ToastContainer />
              </div>
              <div className="col-4">
                {" "}
                <img
                  src={cat}
                  className="rounded-circle pfp-small box"
                  alt="Immagine Profilo"
                  style={{ width: "30%" }}
                />
                <h5 className="mt-0">{userGlobal.username}</h5>
              </div>
            </div>
          </div>
          <div className="card-footer text-body-secondary">
            <div className="row d-flex flex-col align-items-center justify-content-evenly mb-4 flex-xs-wrap">
              <div className="">
                <h4>Giornaliero</h4>
                <button className="yellow-button m-2 box">
                  <h4>prima</h4>
                  {userQuote.remaining_daily}
                </button>
                {newMonth !== 0 && (
                  <>
                    <button className="yellow-button m-2 box">
                      <h4>dopo</h4>
                      {newDay}{" "}
                    </button>
                  </>
                )}
              </div>
              <div className="">
                <h4>Settimanale</h4>
                <button className="yellow-button m-2 box">
                  <h4>prima</h4>
                  {userQuote.remaining_weekly}
                </button>
                {newMonth !== 0 && (
                  <>
                    <button className="yellow-button m-2 box">
                      <h4>dopo</h4>
                      {newWeek}{" "}
                    </button>
                  </>
                )}
              </div>
              <div className="">
                <h4>Mensile</h4>
                <button className="yellow-button m-2 box">
                  <h4>prima</h4>
                  {userQuote.remaining_monthly}
                </button>
                {newMonth !== 0 && (
                  <>
                    <button className="yellow-button m-2 box">
                      <h4>dopo</h4>
                      {newMonth}{" "}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <h2>Squeals Passati: {squealsLogger.length}</h2>

          <Container className="">
            <Row className="w-100">
              {squealsLogger.map((squeal) => (
                <Col lg={12} key={squeal.id} className="mb-4">
                  <Card style={{ height: "100%" }} className="squeal">
                    <Card.Header className="d-flex flex-col justify-content-center align-items-center">
                      {" "}
                      <b>{squeal.sender}</b>
                    </Card.Header>
                    <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                      <div>{squeal.content}</div>
                    </Card.Body>
                    <Card.Footer>
                      <div>Id: {squeal._id}</div>

                      <div className="row"> </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Squeal;
