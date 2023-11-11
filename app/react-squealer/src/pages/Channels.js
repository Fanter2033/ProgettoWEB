import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { useCallback } from "react";
import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";
import Chat from "./Chat";

//import { Button, Card, Col, Row } from "react-bootstrap";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";

import "../css/App.css";

function Channels() {
  const { userGlobal, setUserGlobal } = useUserContext();
  console.log("cercatooooooooooooo", userGlobal.username);

  //TODO: GET /dashboard/ ------------------------------------------------------------------------------------------------------------
  /*
  const [dash, setDash] = useState({});

  async function getDashboard() {
    try {
      const uri = `${ReactConfig.base_url_requests}/dashboard/`;
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
        console.log("MMMMMMMMMMMMMMMMMMMMMMMH", json);
        setDash(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  */

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

  //!uso in Search e in Home la GET /channels
  //GET /channel    list of channels ------------------------------------------------------------------------------------------------------------
  /*
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
      } 
      else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("LISTA CANALI", channels);

  -----------------------------------------------------

  <h2>Lista TUTTI i Canali:</h2>
            <Row className="ms-4 me-4">
              {channels.map((channel) => (
                <Col key={channel.id} lg={6} className="mb-4 ">
                  <Card>
                    <Card.Body className="mb-4 d-flex flex-row">
                     
                      <Card.Title className="ms-4 me-4">
                        {channel.channel_name}
                      </Card.Title>

                      <Link to="/infoc" >
                        <Button variant="primary" className="ms-4 me-4">
                          Info
                        </Button>
                      </Link>

                      <Button variant="primary">Segui</Button>
                    
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
*/

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

  const [functionsCalled, setFunctionsCalled] = useState(false);

  useEffect(() => {
    if (!functionsCalled) {
      //getChannels();
      getUserData();
      //getDashboard();
      setFunctionsCalled(true);
    }
  }, [functionsCalled]);

  return (
    <div>
      <Navbar />
      <div className="container-flex">
        <div className="row" onLoad={getUserData}>
          <div className="col-12 col-md-9">
            <h1>HOME</h1>

            <div>
              <ChannelForm />
            </div>

            <div>
              <Search />
            </div>

            <div className="row d-flex justify-content-center ms-1 me-1">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4">
                <li className="list-group-item list">GET /channel/type</li>
                <li className="list-group-item list">GET /dashboard/ </li>
                <li className="list-group-item list">GET /chat/ </li>
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
