import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Search from "./Search";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";

import { Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

function Channels() {
  const { userGlobal, setUserGlobal } = useUserContext();
  console.log("cercatooooooooooooo", userGlobal.username);
  console.log("viiiiiiiiiiiiiiiiiiiiiiiiiiiip", userGlobal.vip);

  const navigate = useNavigate();
  if (userGlobal.username === undefined) {
    navigate("./");
  }

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

        setUserGlobal(data);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //!uso in Search e in Home la GET /channels
  //GET /channel    list of channels ------------------------------------------------------------------------------------------------------------

  const [channels, setChannels] = useState([]);

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
      getUserData();
      getChannels();
      setFunctionsCalled(true);
    }
  }, [functionsCalled]);

  return (
    <div>
      <div className="container-flex">
        <div className="row" onLoad={getUserData}>
          <div className="col-12 mt-5">
            <div>
              <ChannelForm />
              <Search />
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center ms-1 me-1 mb-5 w-100">
          <h3>TODO:</h3>
          <ul className="list-group col-md-4">
            <li className="list-group-item list">FOLLOW NON VA</li>
            <li className="list-group-item list">
              GESTIONE RUOLI: PATCH new_role
            </li>
            <li className="list-group-item list">CREARE CANALI UFFICIALI</li>
            <li className="list-group-item list">CREARE 3 CANALI API</li>
            <li className="list-group-item list">
              URL: limit, offset, search, orerBy, orderDir
            </li>
            <li className="list-group-item list">GET #</li>
            <li className="list-group-item list">PFP CANALI</li>
            <li className="list-group-item list">
              criterio squeals appartenenza canale
            </li>
            <li className="list-group-item list">suono!</li>
            <li className="list-group-item list">canali bloccati???</li>
            <li className="list-group-item list">canali popolarità??</li>
            <li className="list-group-item list">canali silenziabili??</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;
