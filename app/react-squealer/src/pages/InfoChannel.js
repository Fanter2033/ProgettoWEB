import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import "../css/App.css";

function InfoChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  //!{type}/{channel_name}
  //TODO: GET /channel/{type}/{channel_name}    channel info
  const getChTypeName = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name};`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Channel info:", data);
      })
      .catch((error) => {
        console.error("Failed to get channel info, errore:", error);
      });
  };
  
  //TODO: GET /channel/{type}/{channel_name}/users/     list of following
  const getChTypeNameUsers = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/;`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Following of a channel:", data);
      })
      .catch((error) => {
        console.error("Failed to get the following, errore:", error);
      });
  };
  //TODO: GET /channel/{type}/{channel_name}/roles/{roles}    roles following a ch
  const getAllRoles = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/roles/${channel.roles} ;`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get all the roles:", data);
      })
      .catch((error) => {
        console.error("Failed to get all the roles, errore:", error);
      });
  };

  //!se iscritto
  //TODO: GET /channel/{type}/{channel_name}/users/{username}/     role of user
  const getMyRole = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${userGlobal};`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get the role of the user:", data);
      })
      .catch((error) => {
        console.error("Faillllllll, errore:", error);
      });
  };

  //!se sei il proprietario
  //una variabile booleana
  const isOwner = channel.owner === userGlobal;

  const handleDeleteChannel = () => {
    //TODO: DELETE /channel/{type}/{channel_name}
    console.log("Canale eliminato:", channel.channel_name);
  };

  const handleChangeChannelName = () => {
    //TODO: PUT channel/{type}/{channel_name} per cambiare nome
    //TODO: PATCH /channel/{type}/{channel_name}/{username}   change role user
    console.log("Cambiato il nome del canale:", channel.channel_name);
  };

  useEffect(() => {
    const intervalId1 = setInterval(getChTypeName, 5000);
    const intervalId2 = setInterval(getChTypeNameUsers, 5000);
    const intervalId4 = setInterval(getAllRoles, 5000);

    //se iscritto
    const intervalId3 = setInterval(getMyRole, 5000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
    };
  });

  console.log("ownerrrrrrrrrrrrrrrrr " + channel.owner);
  console.log("userrrrrrrrrrrrrrrrrrr " + userGlobal.username);

  const mamma = () => {
    alert("non va useHistory, va capito come fare");
  };

  const follow = () => {
    alert("da farrrrrrrrrrrrrrrrrr");
  };

  return (
    <div>
      <div>
        <button className="user_button" onClick={follow}>
          Segui
        </button>
        <button id="logout-button" onClick={mamma}>
          Torna Indietro
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "3em",
          margin: "0",
          borderRadius: "5px",
        }}
      >
        <h3 className="cool-font-medium">
          Channel Name: {channel.channel_name}
        </h3>
        <p className="cool-font-small">Type: {channel.type}</p>
        <p className="cool-font-small">Private: {channel.private.toString()}</p>
        <p className="cool-font-small">Owner: {channel.owner}</p>
        <p className="cool-font-small">Subscribers: {channel.subscribers}</p>
        <p className="cool-font-small">Posts: {channel.posts}</p>
      </div>

      {isOwner && (
        <div>
          <h2>Creatore del canale</h2>
          <button onClick={handleDeleteChannel}>DELETE CHANNEL</button>
          <button onClick={handleChangeChannelName}>CHANGE CHANNEL NAME</button>
        </div>
      )}
    </div>
  );
}

export default InfoChannel;
