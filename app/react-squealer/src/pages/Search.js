import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Row, Card, Col, Container } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";

//GET /channel  list of channels ------------------------------------------------------------------------------------------------------------
function Search() {
  const { userGlobal, setUserGlobal } = useUserContext();

  //SEARCH FETCH
  const [inputValue, setInputValue] = useState("");
  const [channels, setChannels] = useState([]);

  const searchChannel = () => {
    const url = `${
      ReactConfig.base_url_requests
    }/channel?search=${encodeURIComponent(inputValue)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //console.log("Dati ricevuti dalla search:", data);
        let camp = data.channels;
        setChannels(camp);
      })
      .catch((error) => {
        console.error("Search fallita, errore:", error);
      });
  };

  useEffect(() => {
    // aggiungiamo un ritardo prima di effettuare la richiesta
    const delayTimer = setTimeout(() => {
      searchChannel();
    }, 1000); //2sec

    // puliamo il timer precedente se l'utente continua a digitare
    return () => clearTimeout(delayTimer);
  }, [inputValue]);

  //GET /user/{username}/roles/ LISTA CANALI SEGUITI E IL REALATIVO RUOLO DELL'UTENTE
  const [roleUser, setRoleUser] = useState([]);
  async function getRoles() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/roles/`;
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
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    //console.log("Successo nella richiesta dei ruoli UTENTE", roleUser);
  }

  useEffect(() => {
    getRoles();
  }, []);

  //PATCH /channel/{type}/{channel_name}  FOLLOW CHANNEL
  async function follow(type, channel_name) {
    const url = `${ReactConfig.base_url_requests}/channel/${type}/${channel_name}`;
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
  }

  //DELETE /channel/{type}/{name}/users/{username}/ UNFOLLOW CHANNEL
  async function unfollow(type, channel_name) {
    const uri = `${ReactConfig.base_url_requests}/channel/${type}/${channel_name}/users/${userGlobal.username}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("Delete role successful :)");
        } else {
          console.error("Delete role failed :(", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

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

  return (
    <div className="col-10 offset-1 pb-5">
      <form className="d-flex mb-3" role="search">
        <input
          style={{ height: "3rem" }}
          className="form-control ms-2 me-2 p-0 text-center cool-font-text mt-2"
          type="search"
          placeholder="🔍 CERCA"
          aria-label="Search"
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>

      <div>
        {
          <Container>
            {channels.map((channel) => (
              <Col lg={12} key={channel.channel_name}>
                <Card style={{ height: "100%" }} className="squeal mb-4">
                  <Card.Header className="d-flex justify-content-center align-items-center">
                    <Link to="/infoc" state={channel}>
                      <button className="custom-button me-2 box cool-font-small">
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

                    {channel.type === "CHANNEL_USERS" && (
                      <div>
                        {roleUser.some(
                          (role) => role.channel_name === channel.channel_name
                        ) ? (
                          <button
                            className="red-button box cool-font-xsm"
                            onClick={() =>
                              unfollow(channel.type, channel.channel_name)
                            }
                          >
                            DISISCRIVITI
                          </button>
                        ) : (
                          <button
                            className="green-button box cool-font-xsm"
                            onClick={() =>
                              follow(channel.type, channel.channel_name)
                            }
                          >
                            ISCRIVITI
                          </button>
                        )}
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {roleUser.map((role) => (
                        <>
                        <Col key={role._id}>
                        
                          <Row
                            
                            lg={12}
                            className="d-flex justify-content-center align-items-center cool-font-details"
                          >
                            {role.role === 0 &&
                              role.channel_name === channel.channel_name &&
                              channel.type === "CHANNEL_USERS" && (
                                <>
                                  <div>
                                    RUOLO: <b>IN ATTESA</b>
                                    <button className="custom-button ms-2 box">
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
                                    <button className="custom-button ms-2 box">
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
                                    <button className="custom-button ms-2 box">
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
                                    <button className="custom-button ms-2 box">
                                      ⚔️
                                    </button>
                                  </div>
                                </>
                              )}
                            {role.role === 4 &&
                              role.channel_name === channel.channel_name && (
                                <>
                                  <div>
                                    RUOLO: <b>OWNER</b>
                                    <button className="custom-button ms-2 box">
                                      👑
                                    </button>
                                  </div>
                                </>
                              )}
                          </Row>
                          </Col>
                        </>
                      ))}
                    </div>

                    <div className="d-flex flex-row justify-content-center align-items-center cool-font-details">
                      {channel.type === "CHANNEL_USERS" && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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
                          <div className="cool-font-text">
                            &nbsp;CANALE UFFICIALE
                          </div>
                        </>
                      )}
                      {channel.type === "CHANNEL_HASHTAG" && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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

                    <div className="d-flex flex-row justify-content-center align-items-center cool-font-details">
                      {channel.private === true ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
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
                            width="20"
                            height="20"
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

                    <div className="d-flex flex-row justify-content-center align-items-center cool-font-link">
                      {channel.locked && (
                        <>
                          <div className="altro d-flex flex-row justify-content-center align-items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-ban"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15 8a6.973 6.973 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                            </svg>
                            <div> &nbsp;BLOCCATO</div>
                          </div>
                        </>
                      )}
                    </div>
                    {channel.type === "CHANNEL_USERS" && (
                      <>
                        <div className="cool-font-details">
                          {channel.owner === userGlobal.username ? (
                            <></>
                          ) : (
                            <> CREATORE: {channel.owner}</>
                          )}
                        </div>
                        <div className="cool-font-details">
                          ISCRITTI: <b>{channel.subscribers}</b>
                        </div>
                      </>
                    )}

                    <div className="d-flex flex-column justify-content-center align-items-center cool-font-details">
                      <>
                        <div>
                          SQUEAL: <b>{channel.posts}</b>
                        </div>
                      </>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Container>
        }
        {channels.length === 0 && (
          <>
            <h3 className="cool-font-link">Channel does not exist</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
