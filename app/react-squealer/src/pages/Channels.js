import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//import Post from "./Post";
import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";
import ModalForm from "./ModalForm";

/* 
TODO: let the chat disapper when on sm screen
*/

function Channels() {
  const location = useLocation();
  const { username } = location.state;

  console.log(username);

  /*
  const [users, setUsers] = useState([]);


  async function getChannels() {
  
    let result = fetch(`${ReactConfig.base_url_requests}/channels`);
    let response = await result;
    if(response.ok){
      let json = await response.json();
      setUsers(json.users);
      return json.users;
    }
  }

  useEffect(() => {
  }, []);
*/
  //TODO: GET /channel    list of channels
  //const [channels, setChannels] = useState("");

  async function getChannels() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel`;
      let result = await fetch(uri);

      if (result.ok) {
        let channels = await result.json();
        console.log(channels);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  useEffect(() => {
    const intervalId = setInterval(getChannels, 10000);
    return () => {
      clearInterval(intervalId);
    };
  });

  //TODO: GET /channels/{type}
  //types: CHANNEL_OFFICIAL, CHANNEL_USERS, CHANNEL_HASHTAG

  /*
  async function getOfficialChannel() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channels/${type}`;
      let result = await fetch(uri);
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
  useEffect(() => {
    const intervalId = setInterval(getOfficialChannel, 10000);
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
            <h1>{username}</h1>
            <h1>CHANNELS</h1>
            <div>
              <Search />
            </div>

            <ModalForm />

            <div className="row justify-content-center">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4">
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
