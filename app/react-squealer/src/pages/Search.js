import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Row, Card, Col, Container } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";

//TODO: se non esiste: NOT FOUND
//GET /channel  list of channels ------------------------------------------------------------------------------------------------------------
function Search() {
  const { userGlobal, setUserGlobal } = useUserContext();

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
  //console.log(channels);

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

  //TODO: IMPLEMENT FILTER: user, channels: official, user, tag
  //GET /channel/{type} list of channel------------------------------------------------------------------------------------------------------------
  //types: CHANNEL_OFFICIAL, CHANNEL_USERS, CHANNEL_HASHTAG
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

  //DROPDOWN MENU
  const [ty, setTy] = useState("");
  const [list, setList] = useState([]);
  const [click, setClick] = useState(false);

  const handleOptionChange = (e) => {
    const selectedValue = e.target.value;
    setTy(selectedValue);
  };

  async function getTypes() {
    setClick(true);
    //console.log("TYYYYYYYYYYYYYYPE", ty);

    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${ty}`;

      let result = await fetch(uri);

      if (result.ok) {
        let listCH = await result.json();
        console.log("WWWWWWWWWWWWWWWWWWEIRD", listCH);
        setList(listCH.channels);
        //return list;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //console.log("LISTAAAAAAAA", list);

  //BOTTONI PRIVATI E PUBBLICI
  const [publicChannel, setPublicChannel] = useState(false);
  const [privateChannel, setPrivateChannel] = useState(false);
  const getPrivate = () => {
    setPrivateChannel(true);
  };
  const getPublic = () => {
    setPublicChannel(true);
  };
  console.log(privateChannel);
  console.log(publicChannel);

  const removeFilter = () => {
    setClick(false);
    setTy("");
    setPublicChannel(false);
    setPrivateChannel(false);
  };

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

          {ty === "CHANNEL_USERS" && (
            <>
              <button className="yellow-button box" onClick={getPrivate}>
                PRIVATI
              </button>
              <button className="yellow-button box" onClick={getPublic}>
                PUBBLICI
              </button>
            </>
          )}
          {ty !== "" && (
            <>
              <button className="green-button box" onClick={getTypes}>
                FILTRA
              </button>
              <button className="red-button box" onClick={removeFilter}>
                TOGLI FILTRO
              </button>
            </>
          )}
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

      {!click && (
        <Container fluide>
          {channels.map((channel) => (
            <Col key={channel.id} lg={12}>
              <Card style={{ height: "100%" }} className="squeal mb-4">
                <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                  <Card.Title className="">{channel.channel_name}</Card.Title>

                  <Link to="/infoc" state={channel}>
                    <button className="custom-button mb-2">Info</button>
                  </Link>
                  {channel.owner === userGlobal.username && (
                    <button className="red-button">your channel</button>
                  )}
                  {channel.owner !== userGlobal.username && (
                    <button className="custom-button mb-2" onClick={follow}>
                      Segui
                    </button>
                  )}

                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {channel.private === true ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-lock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                        </svg>
                        <p>PRIVATE</p>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-unlock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
                        </svg>
                        <p>PUBLIC</p>
                      </>
                    )}
                  </div>

                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {channel.type === "CHANNEL_USERS" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-person-raised-hand"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a.998.998 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
                        <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                      </svg>
                    )}
                    {channel.type === "CHANNEL_OFFICIAL" && (
                      <img
                        src={squeal_logo}
                        alt="logo_squeal"
                        width="40"
                        height="40"
                      />
                    )}
                    {channel.type === "CHANNEL_HASHTAG" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-tag-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                      </svg>
                    )}
                    <div>{channel.type}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Container>
      )}

      {click && privateChannel && (
        <>
          <Row className="">
            {list.map((channel) => (
              <Col key={channel.id} lg={12} >
                {channel.private === true && (
                  <>
                    <Card className="squeal mb-3">
                      <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                        <Card.Title className="">
                          {channel.channel_name}
                        </Card.Title>

                        <Link to="/infoc" state={channel}>
                          <button className="custom-button mb-2">Info</button>
                        </Link>
                        <div className="d-flex flex-row justify-content-center align-items-center"></div>
                        {channel.owner === userGlobal.username && (
                          <button className="red-button">your channel</button>
                        )}
                        {channel.owner !== userGlobal.username && (
                          <button
                            className="custom-button mb-2"
                            onClick={follow}
                          >
                            Segui
                          </button>
                        )}
                        <p>PRIVATE</p>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </Col>
            ))}
          </Row>
        </>
      )}

      {click && publicChannel && (
        <>
          <Row className="">
            {list.map((channel) => (
              <Col key={channel.id} lg={12} >
                {channel.private === false && (
                  <>
                    <Card className="squeal mb-3">
                      <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                        <Card.Title className="">
                          {channel.channel_name}
                        </Card.Title>

                        <Link to="/infoc" state={channel}>
                          <button className="custom-button mb-2">Info</button>
                        </Link>
                        <div className="d-flex flex-row justify-content-center align-items-center"></div>
                        {channel.owner === userGlobal.username && (
                          <button className="red-button">your channel</button>
                        )}
                        {channel.owner !== userGlobal.username && (
                          <button
                            className="custom-button mb-2"
                            onClick={follow}
                          >
                            Segui
                          </button>
                        )}
                        <p>PUBLIC</p>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </Col>
            ))}
          </Row>
        </>
      )}

      {click && list.length === 0 && (
        <>
          <h1>NO CANALI DI QUESTO TIPO o IN FASE DI CARICAMENTO</h1>
        </>
      )}
    </div>
  );
}

export default Search;
