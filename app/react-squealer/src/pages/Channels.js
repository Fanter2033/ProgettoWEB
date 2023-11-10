import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useEffect, useState } from "react";

//import Post from "./Post";
import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";
import Chat from "./Chat";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";

import { useUserContext } from "../config/UserContext";

function Channels() {
  const { userGlobal, setUserGlobal } = useUserContext();
  console.log("cercatooooooooooooo", userGlobal.username);

  //TODO: GET /dashboard/ ------------------------------------------------------------------------------------------------------------

  //GET USER INFO ------------------------------------------------------
  async function getUserData() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };
      let result = await fetch(uri, options);

      if (result.ok) {
        let data = await result.json();

        console.log("INFO UTENTE", data);
        //console.log("cercataaaaaaaaaaaaaaaaaaa", userGlobal.username);

        setUserGlobal(data);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //GET /channel    list of channels ------------------------------------------------------------------------------------------------------------
  const [channels, setChannels] = useState({});

  async function getChannels() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      console.log("MMMMMMMMMMMMMMMMMMMMMMMH");

      let result = await fetch(uri, options);

      if (result.ok) {
        let json = await result.json();
        console.log("MMMMMMMMMMMMMMMMMMMMMMMH", json);
        let camp = json.channels;
        setChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("LISTA CANALI", channels);

  const [functionsCalled, setFunctionsCalled] = useState(false);

  useEffect(() => {
    if (!functionsCalled) {
      getChannels();
      getUserData();
      setFunctionsCalled(true);
    }
  }, []);

  //TODO: GET /channel/{type} list of channel------------------------------------------------------------------------------------------------------------
  //types: CHANNEL_OFFICIAL, CHANNEL_USERS, CHANNEL_HASHTAG

  //const [ty, seTy] = useState("");

  /*
  const response = {
    "channels": [
      {
        "name": "string",
        "type": "CHANNEL_OFFICIAL",
        "private": false
      }
    ],
    "totalCount": 0
  };
   */

  /*
  async function getTypes() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/{type}`;
      let result = await fetch(uri);
      if (result.ok) {
        let channel = await result.json();
        console.log(channel);
        seTy(channel);
        return channel;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  

  console.log(ty);

  useEffect(() => {
    const intervalId = setInterval(getTypes, 10000);
    return () => {
      clearInterval(intervalId);
    };
  });
  */

  return (
    <div>
      <Navbar />
      <div className="container-flex">
        <div className="row" onLoad={getUserData}>
          <div className="col-12 col-md-9">
            <h1>HOME</h1>

            <div>
              <Search />
            </div>

            <div>
              <ChannelForm />
            </div>

            <div className="row justify-content-center">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4">
                <li className="list-group-item list">GET CHANNELS</li>
                <li className="list-group-item list">GET SQUEALS</li>
                <li className="list-group-item list">GET CHANNEL TYPE</li>
                <li className="list-group-item list">pubblici</li>
                <li className="list-group-item list">privati</li>
                <li className="list-group-item list">hash</li>
                <li className="list-group-item list">silenziabili</li>
                <li className="list-group-item list">popolarità</li>
              </ul>
            </div>
          </div>
          <div className="col-md-3 d-none d-md-block">
            <h1>CHAT</h1>
            <Chat />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;
