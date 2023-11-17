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
  }, [inputValue]); // Esegui useEffect ogni volta che il valore di inputValue cambia

  /**
   * 
   *    const ChannelCard = ({ channel }) => {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Channel Name: {channel.channel_name}</h3>
        <p>Type: {channel.type}</p>
        <p>Private: {channel.private.toString()}</p>
        <p>Locked: {channel.locked.toString()}</p>
        <p>Owner: {channel.owner}</p>
        <p>Subscribers: {channel.subscribers}</p>
        <p>Posts: {channel.posts}</p>
        <Link to="/infoc">
          <button variant="primary" className="ms-4 me-4">
            Info
          </button>
        </Link>
      </div>
    );
  };



  
  /*
  {channels.map((channel, index) => (
        <ChannelCard key={index} channel={channel} />
      ))}
  */

  /*
      <div>
      <h2>Lista Canali:</h2>
      <ul>
        {responseData.channels.map((channel, index) => (
          <li key={index}>
            Channel Name: {channel.channel_name}
          </li>
        ))}
      </ul>
      </div>
*/

  //TODO: PUT channel/{type}/{channel_name}
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
