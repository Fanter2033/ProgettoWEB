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

  //GET /user/{username}/roles/
  const [roleUser, setRoleUser] = useState(0);

  async function getRoles() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/roles`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let data = await result.json();
        //console.log("Successo nella richiesta dei ruoli UTENTE", data);
        setRoleUser(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log(roleUser);
  useEffect(() => {
    getRoles();
  }, []);

  const [myRole, setMyRole] = useState([]);
  //PATCH /channel/{type}/{channel_name}  follow channel
  async function follow(channel) {
    setFollowButton(true);
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Subscribe went good", data);
      })
      .catch((error) => {
        console.error("Subscribe failed, error:", error);
      });

    const url2 = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${userGlobal.username}`;
    fetch(url2)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get the role of the user:", data);
        setMyRole(data);
      })
      .catch((error) => {
        console.error("Faillllllll, errore:", error);
      });

    /*
    console.log(
      "per il canale",
      channel.channel_name,
      "il mio ruolo è:",
      myRole
    );
    */
  }

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
  //console.log(privateChannel);
  //console.log(publicChannel);

  const removeFilter = () => {
    setClick(false);
    setTy("");
    setPublicChannel(false);
    setPrivateChannel(false);
  };

  const [followButton, setFollowButton] = useState(false);
  function changeFollowButton() {
    setFollowButton(false);
  }

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
            <Col lg={12}>
              <Card
                style={{ height: "100%" }}
                key={channel.id}
                className="squeal mb-4"
              >
                <Card.Header className="d-flex justify-content-center align-items-center">
                  <Link to="/infoc" state={channel}>
                    <button className="custom-button me-2">
                      <b className="">{channel.channel_name} &nbsp;</b>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-info-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                    </button>
                  </Link>
                  {channel.owner === userGlobal.username && (
                    <button className="red-button">your channel</button>
                  )}
                  {
                    <>
                      {channel.owner !== userGlobal.username &&
                        !followButton && (
                          <button
                            className="custom-button"
                            onClick={() => {
                              follow(channel);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-plus-lg"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                              />
                            </svg>
                          </button>
                        )}
                    </>
                  }

                  <div>
                    {roleUser.map((role) => (
                      <>
                        <Row
                          key={role.id}
                          lg={12}
                          className="d-flex justify-content-center align-items-center"
                        >
                          {role.role === 0 &&
                            role.channel_name === channel.channel_name && followButton && (
                              <>
                                <div>
                                  RUOLO: <b>IN ATTESA</b>
                                  <button className="custom-button ms-2" >
                                    🕒
                                  </button>
                                </div>
                              </>
                            )}
                          {role.role === 1 &&
                            role.channel_name === channel.channel_name && (
                              <>
                                <div>
                                  RUOLO: <b>LETTORE</b>
                                  <button className="custom-button ms-2">
                                    📖
                                  </button>
                                </div>
                              </>
                            )}
                          {role.role === 2 &&
                            role.channel_name === channel.channel_name && (
                              <>
                                <div>
                                  RUOLO: <b>SCRITTORE</b>
                                  <button className="custom-button ms-2">
                                    ✒️
                                  </button>
                                </div>
                              </>
                            )}
                          {role.role === 3 &&
                            role.channel_name === channel.channel_name && (
                              <>
                                <div>
                                  RUOLO: <b>ADMIN</b>
                                  <button className="custom-button ms-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-check2"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          {role.role === 4 &&
                            role.channel_name === channel.channel_name && (
                              <>
                                <div>
                                  RUOLO: <b>OWNER</b>
                                  <button className="custom-button ms-2">👑</button>
                                </div>
                              </>
                            )}
                        </Row>
                      </>
                    ))}
                  </div>
                </Card.Header>
                <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {channel.type === "CHANNEL_USERS" && (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-person-raised-hand"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a.998.998 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
                          <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                        </svg>
                        <div>&nbsp;CANALE UTENTE</div>
                      </>
                    )}
                    {channel.type === "CHANNEL_OFFICIAL" && (
                      <>
                        <img
                          src={squeal_logo}
                          alt="logo_squeal"
                          width="40"
                          height="40"
                        />
                        <div>&nbsp;CANALE UFFICIALE</div>
                      </>
                    )}
                    {channel.type === "CHANNEL_HASHTAG" && (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-tag-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                        </svg>
                        <div>&nbsp;CANALE TAG</div>
                      </>
                    )}
                  </div>

                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {channel.private === true ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-lock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                        </svg>
                        <div> &nbsp;PRIVATO</div>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-unlock-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2" />
                        </svg>
                        <div> &nbsp;PUBBLICO</div>
                      </>
                    )}
                  </div>

                  <div className="d-flex flex-row justify-content-center align-items-center">
                    {channel.locked && (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-ban"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 8a6.973 6.973 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                        </svg>
                        <div> &nbsp;BLOCCATO</div>
                      </>
                    )}
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <>
                      <div>
                        CREATORE: <b>{channel.owner}</b>
                      </div>
                      <div>
                        SQUEAL: <b>{channel.posts}</b>
                      </div>
                      <div>
                        ISCRITTI: <b>{channel.subscribers}</b>
                      </div>
                    </>
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
              <Col lg={12}>
                {channel.private === true && (
                  <>
                    <Card key={channel.id} className="squeal mb-3">
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
              <Col lg={12}>
                {channel.private === false && (
                  <>
                    <Card key={channel.id} className="squeal mb-3">
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
