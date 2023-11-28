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

  console.log(userQuote);

  useEffect(() => {
    getUserData();
    getUserQuote();

    const intervalId = setInterval(getUserQuote, 10000); //10 sec
    const intervalId2 = setInterval(getUserData, 10000); //10 sec
    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="col-12">
          <button
            className="red-button box"
            onClick={() => window.history.back()}
          >
            Torna Indietro
          </button>
          <div className="row">
            <div className="col-12 d-flex flex-column align-items-center">
              <img
                src={cattyy}
                alt="Foto Profilo"
                className="rounded-circle ms-4 pfp box mt-4"
              />
              <h1 className="cool-font-medium mt-2 mb-2">
                Username: {userData.username}
                {userData.vip && <img src={pink} style={{ width: "10%" }} />}
              </h1>
              <h2>Nome: {userData.first_name}</h2>
              <h2>Cognome: {userData.last_name}</h2>
              <h2>Email: {userData.email}</h2>
              <button className="user_button box col-6">N SQUEALS</button>

              <div className="row d-flex align-items-center justify-content-evenly mb-4">
                <h3 className="mb-4 cool-font-small">Quota rimanente</h3>

                <div className="col-12">
                  <h4>Giornaliero</h4>
                  <button className="yellow-button m-2 box">
                    {userQuote.remaining_daily}
                  </button>
                </div>
                <div className="col-12">
                  <h4>Settimanale</h4>
                  <button className="yellow-button m-2 box">
                    {userQuote.remaining_weekly}
                  </button>
                </div>
                <div className="col-12">
                  <h4>Mensile</h4>
                  <button className="yellow-button m-2 box">
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
