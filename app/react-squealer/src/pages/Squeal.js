import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import CurrentDateTime from "./CurrentDateTime";
import Dest from "./Dest";
import MapComponent from "./MapComponent";
import SquealContent from "./SquealContent";
import TypeSqueal from "./TypeSqueal";
import ShowDest from "./ShowDest";

import imageCompression from "browser-image-compression";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

/*
l'aggiunta di flex-wrap consente agli elementi figlio 
di andare a capo su più righe se lo spazio orizzontale è limitato. 
*/

//offset mi tenere centrata la colonna

/*
<div className="col-4">
                {userData.pfp && !userData.vip && (
                  <img
                    src={"data:image/png;base64," + userData.pfp}
                    alt="Foto Profilo"
                    className="rounded-circle pfp-small box"
                  />
                )}
                {userData.pfp && userData.vip && (
                  <img
                    src={"data:image/png;base64," + userData.pfp}
                    alt="Foto Profilo"
                    className="rounded-circle pfp-vip box"
                  />
                )}

                <h5 className="mt-0">{userGlobal.username}</h5>
              </div>
*/

/*

const secondiInUnMinuto = 60;
const secondiInUnOra = 60 * secondiInUnMinuto;
const secondiInUnGiorno = 24 * secondiInUnOra;
const giorniInUnMese = 30; // un'approssimazione media
const secondiInUnMese = giorniInUnMese * secondiInUnGiorno;
const giorniInUnAnno = 365; // un'approssimazione media, non considerando anni bisestili
const secondiInUnAnno = giorniInUnAnno * secondiInUnGiorno;

console.log('Secondi in un minuto:', secondiInUnMinuto);
console.log('Secondi in un'ora:', secondiInUnOra);
console.log('Secondi in un giorno:', secondiInUnGiorno);
console.log('Secondi in un mese:', secondiInUnMese);
console.log('Secondi in un anno:', secondiInUnAnno);

*/
//PUT SQUEAL /squeal/{identifier_id}  SOLO mappeeeeeeeee------------------------------------------------------------------------------------------------------------
function Squeal() {
  const { userGlobal, setUserGlobal } = useUserContext();
  let [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();

  const childDestRef = useRef();

  //GET WHO AM I--------------------------------------------------------------------------------
  async function whoAmI() {
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          navigate("../");
        }
      })
      .then((data) => {
        setCurrentUser(data);
        setUserGlobal(data);
      })
      .catch((error) => {
        console.error(error);
      });
    //}
  }

  useEffect(() => {
    getUserQuote();
    getUserData();
    log();
  }, [currentUser]);

  const notify_quote = () =>
    toast.error("Quota esaurita", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notify = () =>
    toast.error("Manca il desinatario. Riprovare", {
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
    toast.error(
      "Manca il contenuto? Il dest esiste? Sei iscritta al canale? Sei scrittrice nel canale?",
      {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );

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

  const notify4 = () =>
    toast.error("Minimo 5 sec", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notify5 = () =>
    toast.error("Minimo 2 sec", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifySquealStart = () =>
    toast.success("Aggiornamento della posizione!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifySquealStart2 = () =>
    toast.success("Non chiudere la pagina", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const postSuccess = () =>
    toast.success("Squeal avvenuto con successo!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  //GET USER DATA-----------------------------------------------------------------------------------------------
  const [userData, setUserData] = useState("");

  async function getUserData() {
    if (typeof currentUser.username === "undefined") return;
    try {
      if (typeof currentUser.username === "undefined") return;
      const uri = `${ReactConfig.base_url_requests}/user/${currentUser.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let data = await result.json();
        setUserData(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    console.log(userData);
  }

  //GET QUOTE-----------------------------------------------------------------------------------------------
  const [userQuote, setUserQuote] = useState("");

  async function getUserQuote() {
    if (typeof currentUser.username === "undefined") return;
    try {
      if (typeof currentUser.username === "undefined") return;
      const uri = `${ReactConfig.base_url_requests}/user/${currentUser.username}/quote`;

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
        setUserQuote(quote);
        return quote;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  //GET LOG SQUEALS VECCHI--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function log() {
    if (typeof currentUser.username === "undefined") return;

    try {
      if (typeof currentUser.username === "undefined") return;
      const url = `${ReactConfig.base_url_requests}/utils/squeals/${currentUser.username}`;
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
      console.error("Errore di rete:", error);
    }
    console.log(squealsLogger);
  }

  useEffect(() => {
    whoAmI();
    getUserData();
    getUserQuote();
    log();

    const intervalId = setInterval(getUserQuote, 5000); //30 sec
    const intervalId1 = setInterval(whoAmI, 30000); //30 sec
    const intervalId2 = setInterval(getUserData, 5000); //10 sec

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId1);
      clearInterval(intervalId2);
    };
  }, []);

  useEffect(() => {
    getUserData();
    getUserQuote();
    log();
  }, [currentUser]);

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

  const costImage = (e) => {
    console.log("live day", liveDay);
    const remainingLimitD = liveDay - 125;
    console.log("remaining daily before", remainingLimitD);

    const remainingLimitW = liveWeek - 125;
    const remainingLimitM = liveMonth - 125;

    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
    console.log("remaining daily", remainingLimitD);

    const imageFile = e.target.files[0];
    handleImageUpload(imageFile);
  };

  const handleImageUpload = useCallback(async (imageFile) => {
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

  //POSITION --------------------------------------------------------------------------------
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

  //TEXT_AUTO domande per utente--------------------------------------------------------------
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const handleNumero1Change = (e) => {
    setNumero1(e.target.value);
  };

  const handleNumero2Change = (e) => {
    setNumero2(e.target.value);
  };

  //TEXT_AUTO bottoni ------------------------------------------------------------------------
  const [postText, setPostText] = useState("");
  const [clickedButtons, setClickedButtons] = useState([]);
  const handleAutoText = (e) => {
    const autoText = e.target.value;
    const autoLenght = autoText.length;

    setPostText(autoText);
    // quota rimanente dopo il post
    let remainingLimitD = liveDay - autoLenght;
    let remainingLimitW = liveWeek - autoLenght;
    let remainingLimitM = liveMonth - autoLenght;
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
  };

  const handleButtonClick = (buttonText) => {
    const wordButton = buttonText.length;
    // aggiungi il testo del bottone cliccato al testo del post
    setPostText((prevText) => prevText + buttonText);
    // aggiungi il testo del bottone alla lista dei bottoni cliccati
    setClickedButtons((prevButtons) => [...prevButtons, buttonText]);

    if (newDay === 0) {
      let remainingLimitD = liveDay - wordButton;
      let remainingLimitW = liveWeek - wordButton;
      let remainingLimitM = liveMonth - wordButton;

      setNewDay(remainingLimitD);
      setNewWeek(remainingLimitW);
      setNewMonth(remainingLimitM);
    } else {
      let remainingLimitD = newDay - wordButton;
      let remainingLimitW = newWeek - wordButton;
      let remainingLimitM = newMonth - wordButton;

      setNewDay(remainingLimitD);
      setNewWeek(remainingLimitW);
      setNewMonth(remainingLimitM);
    }
  };

  //POSITION_AUTO --------------------------------------------------------------------------------
  const [autoCoordinates, setAutoCoordinates] = useState(null);
  const handleAutoMaps = (position) => {
    setAutoCoordinates(position);

    //console.log("Coordinate utente:", position);

    const remainingLimitD = liveDay - 125;
    const remainingLimitW = liveWeek - 125;
    const remainingLimitM = liveMonth - 125;
    setNewDay(remainingLimitD);
    setNewWeek(remainingLimitW);
    setNewMonth(remainingLimitM);
  };

  //TYPE INPUT---------------------------------------------------------------------------------
  //inputType = MESSAGE_TEXT, IMAGE, VIDEO_URL, POSITION, POSITION_AUTO
  const [inputType, setInputType] = useState("");
  let inputElement = null;

  if (inputType === "MESSAGE_TEXT") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="userInput" className="form-label cool-font-details-md">
          <b>TESTO</b>
        </label>
        <textarea
          id="userInput"
          style={{ color: "#072f38", backgroundColor: "#528b57" }}
          name="userInput"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Squeal time"
          rows="4"
          cols="50"
          className="form-control box cool-font-link"
        />
      </div>
    );
  } else if (inputType === "IMAGE") {
    inputElement = (
      <div className="mb-3">
        <label htmlFor="imageInput" className="form-label cool-font-details-md">
          <b>IMMAGINE</b>
        </label>

        <input
          type="file"
          id="imageInput"
          name="imageInput"
          style={{ color: "#072f38", backgroundColor: "#528b57" }}
          accept="image/*"
          onChange={costImage}
          className="form-control box cool-light mb-3"
        />
        {base64Image && (
          <>
            <figure className="cool-font-details">
              <img
                src={base64Image}
                alt="Photo you want to post"
                aria-label="Questa è l'immagine o foto che vorresti mandare a un tuo amico o postare su un canale"
              />
              <figcaption>Immagine che stai per postare</figcaption>
            </figure>
          </>
        )}
      </div>
    );
  } else if (inputType === "VIDEO_URL") {
    inputElement = (
      <div className="mb-3">
        <label
          htmlFor="youtubeLink"
          className="form-label cool-font-details-md"
        >
          <b>LINK YouTube</b>
        </label>
        <input
          type="text"
          id="youtubeLink"
          name="videoInput"
          style={{ color: "#072f38", backgroundColor: "#528b57" }}
          value={youtubeLink}
          onChange={handleYoutubeLinkChange}
          className="form-control box cool-font-link"
        />
        {!isValidLink && (
          <p className="cool-font-link mt-1">
            Inserisci un link YouTube valido.
          </p>
        )}
      </div>
    );
  } else if (inputType === "POSITION") {
    inputElement = (
      <div className="mb-3 cool-font-details-md">
        <b>MAPPA</b>
        <MapComponent onLocationChange={handleMarkerAdded} />
      </div>
    );
  } else if (inputType === "TEXT_AUTO") {
    inputElement = (
      <div className="mb-3 text-wrap">
        <label htmlFor="userInput" className="form-label ">
          <b className="cool-font-details-md">MESSAGGIO A TEMPO</b>
          <div className="">
            <label htmlFor="numero1" className="me-2 cool-medium">
              QUANTE RIPETIZIONI?
            </label>
            <input
              type="number"
              id="numero1"
              value={numero1}
              style={{
                width: "20%",
                color: "#072f38",
                backgroundColor: "#528b57",
                borderRadius: "0.5rem",
              }}
              onChange={handleNumero1Change}
            />
          </div>
          <div className="">
            <label htmlFor="numero2" className="me-2 cool-medium">
              OGNI QUANTI SECONDI?
            </label>
            <input
              type="number"
              id="numero2"
              value={numero2}
              style={{
                width: "20%",
                color: "#072f38",
                backgroundColor: "#528b57",
                borderRadius: "0.5rem",
              }}
              onChange={handleNumero2Change}
            />
          </div>
        </label>

        <textarea
          id="userInput"
          name="userInput"
          rows="4"
          cols="50"
          style={{ color: "#072f38", backgroundColor: "#528b57" }}
          placeholder="MINIMO 5 SECONDI"
          value={postText}
          className="form-control box cool-font-link"
          onChange={handleAutoText}
        />
        <div className="text-wrap mt-2">
          <button
            type="button"
            className="custom-button cool-font-small m-1 box"
            onClick={() => handleButtonClick("{NUMERO}")}
          >
            NUMERO
          </button>
          <button
            type="button"
            className="custom-button cool-font-small m-1 box"
            onClick={() => handleButtonClick("{ORA}")}
          >
            ORA
          </button>
          <button
            type="button"
            className="custom-button cool-font-small m-1 box"
            onClick={() => handleButtonClick("{MINUTO}")}
          >
            MINUTO
          </button>
          <button
            type="button"
            className="custom-button cool-font-small m-1 box"
            onClick={() => handleButtonClick("{SECONDO}")}
          >
            SECONDO
          </button>
          <button
            type="button"
            className="custom-button cool-font-small m-1 box"
            onClick={() => handleButtonClick("{DATA}")}
          >
            DATA
          </button>
        </div>
      </div>
    );
  } else if (inputType === "POSITION_AUTO") {
    inputElement = (
      <div className="mb-3 text-wrap">
        <label htmlFor="userInput" className="form-label ">
          <b className="cool-font-details-md">MAPPA A TEMPO</b>
          <div className="">
            <label htmlFor="numero1" className="me-2 cool-medium">
              QUANTE RIPETIZIONI?
            </label>
            <input
              type="number"
              id="numero1"
              style={{
                width: "20%",
                color: "#072f38",
                backgroundColor: "#528b57",
                borderRadius: "0.5rem",
              }}
              value={numero1}
              onChange={handleNumero1Change}
            />
          </div>
        </label>

        <MapComponent onLocationChange={handleAutoMaps} />
      </div>
    );
  }

  const handleResetDestinatariPadre = () => {
    if (childDestRef.current) {
      childDestRef.current.handleResetDestinatari();
    }
  };

  function clear() {
    setNewDay(0);
    setNewWeek(0);
    setNewMonth(0);
    setDestinatariFromDest([]);
    setUserInput("");
    setBase64Image("");
    setYoutubeLink("");
    setIsValidLink(true);
    setNumero1(0);
    setNumero2(0);
    setPostText("");
    setClickedButtons([]);
    handleResetDestinatariPadre();
    /*
    setUserData()
    setUserQuote()
    setMarkerCoordinates()
    setAutoCoordinates()
    */
  }

  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  async function eseguiOgni10Secondi(
    iterazioneCorrente,
    lim,
    id,
    autoCoordinates
  ) {
    //PUT SQUEAL /squeal/ per MAPPE TEMPORIZZATE------------------------------------------------------------------------------------------------------------
    console.log("coordinate", autoCoordinates);
    getLocation();

    //per numero1 volte ongi 5sec
    let data = {};
    data = {
      squeal: {
        destinations: destinatariFromDest,
        sender: userGlobal.username,
        message_type: inputType,
        new_position: userLocation,
      },
    };

    const uri = `${ReactConfig.base_url_requests}/squeal/${id}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(uri, options)
      .then((res) => {
        //console.log(res);
        if (res.ok) {
          //creation ok
          return res.json();
        }
      })
      .then((data) => {
        console.log("Cambio mappa went good");
      })
      .catch((error) => {
        console.error("Cambio mappa failed, error:", error);
      });

    iterazioneCorrente++;
    console.log("ITERAZIONE ORA", iterazioneCorrente);
    if (iterazioneCorrente <= lim) {
      setTimeout(
        () => eseguiOgni10Secondi(iterazioneCorrente, lim, id, userLocation),
        10000
      );
    } else {
      navigate("../");
    }
  }

  //POST SQUEAL /squeal/ MAPPE TEMPORIZZATE------------------------------------------------------------------------------------------------------------
  async function postAuto() {
    let data = {};
    const coordinates = autoCoordinates;
    data = {
      squeal: {
        destinations: destinatariFromDest,
        sender: userGlobal.username,
        message_type: inputType,
        content: coordinates,
      },
    };

    //console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb", coordinates);
    //console.log("aaaaaaaaaaaaaaaaaaaa", markerCoordinates);

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
          //console.log("POST mappa temporizzatra riuscita con successo");
          return response.json();
        }
      })
      .then((json) => {
        // Avvia la prima esecuzione
        const id = json._id;
        notifySquealStart();
        notifySquealStart2();
        eseguiOgni10Secondi(1, numero1, id, coordinates);
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  //POST SQUEAL /squeal/ ------------------------------------------------------------------------------------------------------------
  async function postSqueal(e) {
    e.preventDefault();
    if (newDay < 0 || newWeek < 0 || newMonth < 0) {
      notify_quote();

      const extra = -newDay;
      console.log(extra);
      return null;
    }

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
            sender: currentUser.username,
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
            sender: currentUser.username,
            message_type: inputType,
            content: coordinates,
            auto_iterations: numero1,
            auto_seconds_delay: numero2,
          },
        };

        //console.log("aaaaaaaaaaaaaaaaaaaa", markerCoordinates);
      } else if (inputType === "TEXT_AUTO") {
        // Esegui le operazioni desiderate con il testo del post e i bottoni cliccati
        console.log("Testo del post:", postText);
        console.log("Bottoni cliccati:", clickedButtons);

        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: currentUser.username,
            message_type: inputType,
            content: postText,
            auto_iterations: numero1,
            auto_seconds_delay: numero2,
          },
        };
        if (numero1 === "" || numero2 === "") {
          notify3();
          return;
        }
        if (numero1 < 5) {
          notify4();
          return;
        }
        if (numero2 < 2) {
          notify5();
          return;
        }
      } else if (inputType === "POSITION_AUTO") {
        postAuto();
        return null;
      } else {
        data = {
          squeal: {
            destinations: destinatariFromDest,
            sender: currentUser.username,
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
            postSuccess();
            console.log("POST Squeal riuscita con successo");

            clear();
            navigate("/post");
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
  }

  //-------------------------------------------------------------------
  return (
    <div className="container animated-title">
      <div className="card squeal box p-3 m-2">
        <div className="card-header squeal ">
          <div>
            <CurrentDateTime />
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <Dest
              onDestinatariSubmit={handleDestinatariSubmit}
              handleResetDestinatari={handleResetDestinatariPadre}
              ref={childDestRef}
            />
          </div>

          <div className="mb-3">
            <div
              className="btn-group d-flex justify-content-evenly"
              role="group"
              aria-label="Tipo di Input"
            >
              <button
                type="button"
                className={`bottoni_omologati box m-1 ${
                  inputType === "MESSAGE_TEXT" ? "active" : ""
                }`}
                onClick={() => setInputType("MESSAGE_TEXT")}
                aria-label="messaggio"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
                  className="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                </svg>
              </button>

              <button
                type="button"
                className={`bottoni_omologati box m-1 ${
                  inputType === "IMAGE" ? "active" : ""
                }`}
                onClick={() => setInputType("IMAGE")}
                aria-label="immagine"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
                  className="bi bi-card-image"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                </svg>
              </button>

              <button
                type="button"
                className={`bottoni_omologati box m-1 ${
                  inputType === "VIDEO_URL" ? "active" : ""
                }`}
                onClick={() => setInputType("VIDEO_URL")}
                aria-label="video"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
                  className="bi bi-youtube"
                  viewBox="0 0 16 16"
                  alt="VIDEO_URL"
                >
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                </svg>
              </button>

              <button
                type="button"
                className={` bottoni_omologati box m-1  ${
                  inputType === "POSITION" ? "active" : ""
                }`}
                onClick={() => setInputType("POSITION")}
                aria-label="posizionr"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
                  className="bi bi-geo-alt"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
              </button>

              <button
                type="button"
                className={`bottoni_omologati box m-1 ${
                  inputType === "TEXT_AUTO" ? "active" : ""
                }`}
                onClick={() => setInputType("TEXT_AUTO")}
                aria-label="messaggi temporizzati"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
                  className="bi bi-clock-history"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              </button>

              <button
                type="button"
                className={`bottoni_omologati box m-1 ${
                  inputType === "POSITION_AUTO" ? "active" : ""
                }`}
                onClick={() => setInputType("POSITION_AUTO")}
                aria-label="posizione temporizzata"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="#072f38"
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

          <div className="card-text mb-4">
            <form>{inputElement}</form>
          </div>

          <div className="row d-flex flex-row justify-content-evenly align-items-center ">
            <div className="col-8">
              <button
                className="blue-button box cool-font-medium w-100"
                onClick={postSqueal}
              >
                SQUEAL
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
        <div className="card-footer text-body-secondary">
          <h3 className="cool-font-text cool-font-link">LIVE QUOTA</h3>

          <div className="d-flex justify-content-between cool-font-text text-wrap">
            <div className="text-center">
              <h4>G</h4>
              <button className="col-md-12 yellow-button">
                {newMonth !== 0 && (
                  <>
                    {newDay} <br /> ----- <br />
                  </>
                )}
                {userQuote.remaining_daily}
              </button>
            </div>
            <div className="">
              <h4>S</h4>
              <button className="col-md-12 yellow-button ps-1 pe-1">
                {newMonth !== 0 && (
                  <>
                    {newWeek} <br />
                    ----- <br />
                  </>
                )}
                {userQuote.remaining_weekly}
              </button>
            </div>
            <div className="">
              <h4>M</h4>
              <button className=" col-md-12 yellow-button ps-1 pe-1">
                {newMonth !== 0 && (
                  <>
                    {newMonth} <br />
                    ----- <br />
                  </>
                )}
                {userQuote.remaining_monthly}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 mt-3 mb-5">
        <h2 className="cool-font-link">LOG DEGLI SQUEAL PUBBLICI</h2>
        <h2 className="cool-font-link">NUMERO: {squealsLogger.length}</h2>

        <Row>
          {squealsLogger.map((squeal) => (
            <Col className="m-3" key={squeal._id}>
              <Card className="squeal">
                <Card.Header className="row d-flex flex-col justify-content-between align-items-center">
                  <div className="col-12 d-flex flex-row justify-content-start align-items-center mt-2">
                    <div className="cool-medium">PER:</div>
                    <ShowDest arrayDest={squeal.destinations} />
                  </div>
                </Card.Header>
                <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                  <SquealContent
                    content={squeal.content}
                    type={squeal.message_type}
                    id={squeal._id}
                  />
                </Card.Body>
                <Card.Footer>
                  <div className="row cool-medium">
                    <div className="col-12">
                      <button className="blue-button-status p-1 m-1">
                        👁️ {squeal.critical_mass / 0.25}
                      </button>
                      <button className="green-button-status p-1 m-1">
                        👍🏻 {squeal.positive_value}
                      </button>
                      <button className="red-button-status p-1 m-1">
                        👎🏻 {squeal.negative_value}
                      </button>
                    </div>
                  </div>

                  <TypeSqueal typeSqueal={squeal.message_type} />
                  <div className="cool-medium">
                    COSTO QUOTA: {squeal.quote_cost}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Squeal;
