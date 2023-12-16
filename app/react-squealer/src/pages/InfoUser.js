import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import pink from "./media/avvoltoioEli.png";
import cattyy from "./media/splash.jpeg";
import "../css/App.css";

function InfoUser() {
  const location = useLocation();
  const username = location.state;
  //console.log(username);

  const [userData, setUserData] = useState("");

  async function getUserData() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${username}`;
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
        console.log(data);
        setUserData(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("aaaaaaaaaaaaaa", userData);

  //GET USER QUOTE-----------------------------------------------------------------------------------------------
  const [userQuote, setUserQuote] = useState("");

  async function getUserQuote() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${username}/quote`;

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

  //console.log(userQuote);

  //GET LOG SQUEALS VECCHI--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function log() {
    try {
      const url = `${ReactConfig.base_url_requests}/utils/squeals/${username}`;
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
    getUserData();
    getUserQuote();
    log();

    const intervalId = setInterval(getUserQuote, 10000); //10 sec
    const intervalId2 = setInterval(getUserData, 10000); //10 sec
    const intervalId3 = setInterval(getUserData, 10000); //10 sec
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
    };
  }, []);

  //PFP----------------------------------------------------------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="container pb-5">
        <div className="col-12">
          <button
            className="red-button box w-25 mt-2"
            onClick={() => window.history.back()}
            aria-label="clicca se vuoi tornare alla pagina precedente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-left"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />
            </svg>
          </button>
          <div className="row mb-5">
            <div className="col-12 d-flex flex-column align-items-center cool-font-small mt-3">
              {userData.pfp && userData.vip && (
                <img
                  src={"data:image/png;base64," + userData.pfp}
                  alt="Foto Profilo"
                  className="rounded-circle pfp-vip box"
                  onClick={() => handleImageClick()}
                />
              )}

              {userData.pfp && !userData.vip && (
                <img
                  src={"data:image/png;base64," + userData.pfp}
                  alt="Foto Profilo"
                  className="rounded-circle pfp-vip box"
                  onClick={() => handleImageClick()}
                />
              )}

              <h1 className="cool-font-medium mt-4 mb-2">
                USERNAME: {userData.username}
                {userData.vip && (
                  <>
                    <img
                      src={pink}
                      style={{ width: "10%" }}
                      alt="profile foto of user"
                      aria-label="Questa icona è renderizzata in maniera condizionale ed è visibile unicamente per utenti vip"
                    />
                  </>
                )}
              </h1>
              <h2 className="cool-font-medium">NOME: {userData.first_name}</h2>
              <h2 className="cool-font-medium">
                COGNOME: {userData.last_name}
              </h2>
              <h2 className="cool-font-medium">EMAIL: {userData.email}</h2>
              <button className="user_button box col-6">
                N SQUEALS: {squealsLogger.length}
              </button>

              <div className="row d-flex align-items-center justify-content-evenly mt-4">
                <div className="cool-font-link ">QUOTA RIMANENTE</div>

                <div className="col-12 m-2">
                  <h4 className="cool-font-medium">Giornaliero</h4>
                  <button className="yellow-button  box w-50">
                    {userQuote.remaining_daily}
                  </button>
                </div>
                <div className="col-12 m-2">
                  <h4 className="cool-font-medium">Settimanale</h4>
                  <button className="yellow-button box w-50">
                    {userQuote.remaining_weekly}
                  </button>
                </div>
                <div className="col-12 m-2">
                  <h4 className="cool-font-medium">Mensile</h4>
                  <button className="yellow-button  box w-50">
                    {userQuote.remaining_monthly}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoUser;
