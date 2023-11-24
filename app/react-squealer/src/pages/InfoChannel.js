import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

//! PUT dei canali???
function InfoChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  //TODO: PATCH /channel/{type}/{channel_name}  follow channel
  const follow = () => {
    const data = {
      channel: {
        name: channel.channel_name,
        type: "CHANNEL_USERS",
        private: false,
      },
    };

    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //creation ok
          return res.json();
        }
      })
      .then((data) => {
        console.log("Subscribe went good", data);
      })
      .catch((error) => {
        console.error("Subscribe failed, error:", error);
      });
  };

  return (
    <div>
      <div>
        <h3 className="cool-font-medium">
          Nome Canale: {channel.channel_name}
        </h3>
        <Link to="/details" state={channel}>
          <button className="yellow-button bot">Info</button>
        </Link>

        <button
          className="red-button box"
          onClick={() => window.history.back()}
        >
          &lt;-
        </button>
      </div>

      <div>
        <h1 className="cool-font">Squeals</h1>
        <br></br>
      </div>
    </div>
  );
}

export default InfoChannel;

/*
  //GET /channel/{type}/{channel_name}    channel info PRENDO LE INFO da useLocation
  const [info, setInfo] = useState([]);
  const getChTypeName = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Channel info:", data);
        setInfo(data);
      })
      .catch((error) => {
        console.error("Failed to get channel info, errore:", error);
      });
  };
*/
