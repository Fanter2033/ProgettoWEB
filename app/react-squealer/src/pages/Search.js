import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { Row, Card, Col, Container } from "react-bootstrap";
import "../css/App.css";

//TODO: se non esiste: NOT FOUND
//GET /channel  list of channels ------------------------------------------------------------------------------------------------------------
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

  //TODO: GET /channel/{type} list of channel------------------------------------------------------------------------------------------------------------
  //types: CHANNEL_OFFICIAL, CHANNEL_USERS, CHANNEL_HASHTAG

  //DROPDOWN MENU
  const [ty, setTy] = useState("");
  const [list, setList] = useState([]);

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    setTy(selectedValue);
  };

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

  //TODO: IMPLEMENT FILTER: user, channels: official, user, tag
  async function getTypes() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${ty}`;
      let result = await fetch(uri);
      if (result.ok) {
        let listCH = await result.json();
        setList(listCH);
        return listCH;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  let arrayChannel = list.channels;
  //console.log("LISTAAAAAAAA", arrayChannel);

  /**
   <Row className="">
        {arrayChannel.map((channel) => (
          <Col key={channel.id} lg={6} className="mb-4">
            <Card>
              <Card.Body className="mb-4 d-flex flex-row">
                <Card.Title className="">{channel.channel_name}</Card.Title>

                <Link to="/infoc" state={channel}>
                  <button className="custom-button me-2">Info</button>
                </Link>

                <button className="custom-button">Segui</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
   */
  return (
    <div id="" className="col-6 offset-3">
      <div className="row mb-2 d-flex flex-column justify-content-center align-items-center">
        <div className="col-12">
          <select
            className="form-select me-2"
            id="dropdown"
            value={ty}
            onChange={handleOptionChange}
          >
            <option value="">Filtro</option>
            <option value="CHANNEL_USERS">§ : Utenti</option>
            <option value="CHANNEL_OFFICIAL">§ : UFFICIALI</option>
            <option value="CHANNEL_HASHTAG"># : Tag</option>
          </select>

          <button className="yellow-button" onClick={getTypes}>
            FILTRA
          </button>
        </div>
      </div>

      <form className="d-flex mb-3" role="search">
        <input
          className="form-control ms-2 me-2 p-0"
          type="search"
          placeholder="   🔍"
          aria-label="Search"
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="custom-button-yellow" type="submit">
          Cerca
        </button>
      </form>
      <Container fluide>
        {channels.map((channel) => (
          <Col key={channel.id} lg={12} >
            <Card style={{ height: "100%"}} className="squeal mb-4">
              <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="">{channel.channel_name}</Card.Title>

                <Link to="/infoc" state={channel}>
                  <button className="custom-button mb-2">Info</button>
                </Link>
                <button className="custom-button mb-2" onClick={follow}>
                  Segui
                </button>
                <div>{channel.type}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Container>
    </div>
  );
}

export default Search;
