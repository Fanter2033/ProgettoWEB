import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//import Post from "./Post";
import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";
//import ModalForm from "./ModalForm";

/* 
TODO: let the chat disapper when on sm screen
*/

function Channels() {
  const location = useLocation();
  const { username } = location.state;

  console.log(username);

  //TODO: aggiungi toast?

  //TODO: GET /channel    list of channels ------------------------------------------------------------------------------------------------------------
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

      let result = await fetch(uri, options);

      if (result.ok) {
        let json = await result.json();
        console.log(json);
        let camp = json.channels;
        setChannels(camp);
        return camp;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("obj", channels);

  const ch = channels.name;
  console.log("campo canali dell'obj", ch);

  //const channelsArray = Object.values(channels.channels);
  //console.log(channelsArray);

  useEffect(() => {
    const intervalId = setInterval(getChannels, 5000);
    return () => {
      clearInterval(intervalId);
    };
  });

  //TODO: GET /channels/{type} ------------------------------------------------------------------------------------------------------------
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

  //TODO GET SQUEAL /squeal/------------------------------------------------------------------------------------------------------------
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

  return (
    <div>
      <Navbar username={username} />
      <div className="container-flex" onLoad={getChannels}>
        <div className="row">
          <div className="col-md-9">
            <h1>HOME</h1>

            <div>
              <Search />
            </div>

            <div>
              <ChannelForm username={username} />
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
          <div className="col-md-3">
            <h1>CHAT</h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;
