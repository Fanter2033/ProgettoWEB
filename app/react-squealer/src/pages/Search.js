import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { Card, Col, Row } from "react-bootstrap";

import "../css/App.css";

//TODO: se non esiste: NOT FOUND
//GET /channel    list of channels ------------------------------------------------------------------------------------------------------------
function Search() {
  const [inputValue, setInputValue] = useState("");
  const [channels, setChannels] = useState([]);

  const fetchData = () => {
    const url = `${
      ReactConfig.base_url_requests
    }/channel?search=${encodeURIComponent(inputValue)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dati ricevuti dalla search:", data);
        let camp = data.channels;
        setChannels(camp);
      })
      .catch((error) => {
        console.error("Search fallita, errore:", error);
      });
  };
  console.log(channels);

  useEffect(() => {
    // Aggiungi un ritardo prima di effettuare la richiesta
    const delayTimer = setTimeout(() => {
      fetchData();
    }, 1000); //2sec

    // Pulisci il timer precedente se l'utente continua a digitare
    return () => clearTimeout(delayTimer);
  }, [inputValue]);


  //TODO: follow a channel
  const follow = () => {
    alert("il follow è da implementare :)");
  };

  return (
    <div id="" className="col-6 offset-3">
      <form className="d-flex mb-3" role="search">
        <input
          className="form-control ms-2 me-2 p-0"
          type="search"
          placeholder="   🔍"
          aria-label="Search"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="custom-button" type="submit">
          Search
        </button>
      </form>

      <Row className="">
        {channels.map((channel) => (
          <Col key={channel.id} lg={6} className="mb-4">
            <Card>
              <Card.Body className="mb-4 d-flex flex-row">
                <Card.Title className="">{channel.channel_name}</Card.Title>

                <Link to="/infoc" state={channel}>
                  <button className="custom-button me-2">
                    Info
                  </button>
                </Link>

                <button className="custom-button" onClick={follow}>
                  Segui
                </button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Search;
