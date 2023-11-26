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
    navigate("/");
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

  const [functionsCalled, setFunctionsCalled] = useState(false);

  useEffect(() => {
    if (!functionsCalled) {
      getUserData();
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
            <li className="list-group-item list">follow button</li>
            <li className="list-group-item list">se seguo cambia a seguito</li>
            <li className="list-group-item list">channel blocked</li>
            <li className="list-group-item list">PATCH new_role</li>
            <li className="list-group-item list">
              QUERY GET /channel e /channel/$type
            </li>
            <li className="list-group-item list">limit</li>
            <li className="list-group-item list">offset</li>
            <li className="list-group-item list">search:</li>
            <li className="list-group-item list">orerBy</li>
            <li className="list-group-item list">
              orderDir='ORDER_ASC' || 'ORDER_DESC'
            </li>
            <li className="list-group-item list">pfp channels</li>
            <li className="list-group-item list">GET #</li>
            <li className="list-group-item list">popolarità??</li>
            <li className="list-group-item list">silenziabili??</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;

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
