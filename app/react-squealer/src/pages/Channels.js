import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Search from "./Search";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";
import DropdownMenu from "./DropdownMenu";
import MenuOfficial from "./MenuOfficial";
import MenuTag from "./MenuTag";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";


/*
jADiaT60QVDL3bR4I8etxbYBbxT3YtnMOIq2r4LD
*/
function Channels() {
  const { userGlobal, setUserGlobal } = useUserContext();

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

  //!CH TYPE---------------------------------------------------------------------------------------------------------------
  //GET /channel    list of channels TAGS ------------------------------------------------------------------------------------------------------------
  const [tagChannel, setTagChannels] = useState([]);
  const [userChannel, setUserChannels] = useState([]);
  const [officialChannel, setOfficialChannels] = useState([]);

  async function getTagChannels(orderOption) {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${orderOption}`;
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
        setTagChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }

    console.log("LISTA CANALI TAGS", tagChannel);
  }

  //popolarità
  async function popularity(orderOption) {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${orderOption}`;

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
        setUserChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }

    console.log("LISTA CANALI USER", userChannel);
  }

  ///GET /channel    list of channels USERS-------------------------------------------------------------
  async function getUserChannels(orderOption) {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${orderOption}`;

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
        setUserChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }

    console.log("LISTA CANALI USER", userChannel);
  }

  ///GET /channel    list of channels OFFICIAL-------------------------------------------------------
  async function getOfficialChannels(orderOption) {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${orderOption}`;
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
        setOfficialChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }

    console.log("LISTA CANALI OFFICAL", officialChannel);
  }

  //----------------------------------------------------------------------------

  const [functionsCalled, setFunctionsCalled] = useState(false);

  useEffect(() => {
    if (!functionsCalled) {
      getUserData();
      setFunctionsCalled(true);
    }
  }, [functionsCalled]);

  //TYPE BUTTON STAFF
  const [clickTag, setClickTag] = useState(false);
  const changeClickTag = () => {
    setClickTag(!clickTag);
  };

  const [clickUser, setClickUser] = useState(false);
  const changeClickUser = () => {
    setClickUser(!clickUser);
  };

  const [clickOfficial, setClickOfficial] = useState(false);
  const changeClickOfficial = () => {
    setClickOfficial(!clickOfficial);
  };

  //----------------------------
  const handleOrderChange = (orderOption) => {
    getUserChannels(orderOption);
  };

  const handleOfficial = (orderOption) => {
    getOfficialChannels(orderOption);
  };

  const handleTag = (orderOption) => {
    getTagChannels(orderOption);
  };

  return (
    <div>
      <div className="container-flex">
        <div className="row" onLoad={getUserData}>
          <div className="row d-flex justify-content-center ms-1 me-1 w-100">
            <h3>TODO:</h3>
            <ul className="list-group col-md-4">
              <li className="list-group-item list">
                GESTIONE RUOLI AMIN: PATCH new_role
              </li>
              <li className="list-group-item list">CREARE 3 CANALI API</li>
              <li className="list-group-item list">URL: limit, offset</li>
              <li className="list-group-item list">
                criterio squeals appartenenza canale
              </li>
              <li className="list-group-item list">
                canali silenziabili o popolari??
              </li>
            </ul>
          </div>
          <div className="col-12 mt-5">
            
            <div>
              <div>
                <div className="d-flex justify-content-center align-items-center"></div>

                <div>
                  <Row>
                    <div className="col-4">
                      <button
                        className="yellow-button box cool-font-text"
                        onClick={changeClickUser}
                      >
                        UTENTE
                      </button>

                      {clickUser && (
                        <>
                          <DropdownMenu onOrderChange={handleOrderChange} />
                        </>
                      )}
                    </div>
                    <div className="col-4">
                      <button
                        className="yellow-button box cool-font-text"
                        onClick={changeClickOfficial}
                      >
                        UFFICIALE
                      </button>
                      {clickOfficial && (
                        <>
                          <MenuOfficial onOrderChange={handleOfficial} />
                        </>
                      )}
                    </div>
                    <div className="col-4">
                      <button
                        className="yellow-button box cool-font-text"
                        onClick={changeClickTag}
                      >
                        TAG
                      </button>
                      {clickTag && (
                        <>
                          <MenuTag onOrderChange={handleTag} />
                        </>
                      )}
                    </div>
                  </Row>
                  {clickOfficial && (
                    <>
                      {officialChannel.map((u) => (
                        <Card key={u.id} className="squeal mb-4">
                          <Card.Header className="d-flex justify-content-center align-items-center">
                            <Link to="/infoc" state={u}>
                              <button className="custom-button me-2">
                                <b className="">{u.channel_name} &nbsp;</b>

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
                            {u.owner === userGlobal.username && (
                              <button className="red-button">TUO</button>
                            )}
                          </Card.Header>
                          <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row justify-content-center align-items-center">
                              {u.private === true ? (
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
                              {u.locked && (
                                <>
                                  <div className="altro d-flex flex-row justify-content-center align-items-center">
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
                                  </div>
                                </>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </>
                  )}
                  {clickUser && (
                    <>
                      {userChannel.map((u) => (
                        <Card key={u.id} className="squeal mb-4">
                          <Card.Header className="d-flex justify-content-center align-items-center">
                            <Link to="/infoc" state={u}>
                              <button className="custom-button me-2">
                                <b className="">{u.channel_name} &nbsp;</b>

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
                            {u.owner === userGlobal.username && (
                              <button className="red-button">TUO</button>
                            )}
                          </Card.Header>
                          <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row justify-content-center align-items-center">
                              {u.private === true ? (
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
                              {u.locked && (
                                <>
                                  <div className="altro d-flex flex-row justify-content-center align-items-center">
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
                                  </div>
                                </>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </>
                  )}
                  {clickTag && (
                    <>
                      {tagChannel.map((u) => (
                        <Card key={u.id} className="squeal mb-4">
                          <Card.Header className="d-flex justify-content-center align-items-center">
                            <Link to="/infoc" state={u}>
                              <button className="custom-button me-2">
                                <b className="">{u.channel_name} &nbsp;</b>

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
                            {u.owner === userGlobal.username && (
                              <button className="red-button">TUO</button>
                            )}
                          </Card.Header>
                          <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                            <div className="d-flex flex-row justify-content-center align-items-center">
                              {u.private === true ? (
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
                              {u.locked && (
                                <>
                                  <div className="altro d-flex flex-row justify-content-center align-items-center">
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
                                  </div>
                                </>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <ChannelForm />
          <Search />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;
