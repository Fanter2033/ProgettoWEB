import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Reactions from "./Reactions";
import TypeSqueal from "./TypeSqueal";
import SquealContent from "./SquealContent";
import Comment from "./Comment";
import ShowDest from "./ShowDest";
import ShowComment from "./ShowComment";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import notification from ".//media/message.mp3";
import { map } from "leaflet";

function InfoChannel() {
  const location = useLocation();

  const [channel, setChannel] = useState(location.state);
  console.log(channel);
  if (channel.owner === "") {
    //GET /channel/{type}/{name}/ LISTA INFO CANALE

    try {
      const uri = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      };

      let result = fetch(uri, options);

      if (result.ok) {
        let data = result.json();
        console.log("Successo nella richiesta dei ruoli UTENTE", data);
        setChannel(data);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    //console.log("Successo nella richiesta dei ruoli UTENTE", roleUser);
  }

  const { userGlobal, setUserGlobal } = useUserContext();

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

  //PATCH /channel/{type}/{channel_name}  follow channel
  const follow = () => {
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
  };

  //DELETE /channel/{type}/{name}/users/{username}/ unfollow
  async function unfollow() {
    const uri = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${userGlobal.username}`;
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

  //GET /utils/squeals/{channel_type}/{channel_name}--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  const [newMessageNotification, setNewMessageNotification] = useState(false);

  async function logPast() {
    //console.log("aaaaaaaaaaaaaaaa", channel.channel_name);
    console.log(channel.type);
    try {
      const url = `${ReactConfig.base_url_requests}/utils/squeals/${channel.type}/${channel.channel_name}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      let result = await fetch(url, options);

      //console.log(result);
      if (result.ok) {
        let json = await result.json();

        /*
        if (json.length > squealsLogger.length) {
          setNewMessageNotification(true);
          const audio = new Audio(notification);
          audio.play();
        }
        */
        setSquealsLogger(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    console.log("LOGGERRRRRRRRRRRRRR", squealsLogger);
  }

  useEffect(() => {
    logPast();
    getRoles();
    //const intervalId1 = setInterval(logPast, 10000); //10 sec
    const intervalId2 = setInterval(getRoles, 10000); //10 sec
    const intervalId3 = setInterval(logPast, 5000); //10 sec

    return () => {
      //clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
    };
  }, []);

  useEffect(() => {
    if (newMessageNotification) {
      setNewMessageNotification(false);
    }
  }, [newMessageNotification]);

  return (
    <div className="pb-5">
      <div className="d-flex flex-row align-items-center justify-content-evenly align-items-center pt-3 pb-3">
        <Link to="/details" state={channel}>
          <button className="yellow-button box ">
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

        <button
          className="red-button box"
          onClick={() => window.history.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>

        {channel.type === "CHANNEL_USERS" && (
          <>
            {roleUser.some(
              (role) => role.channel_name === channel.channel_name
            ) ? (
              <button
                className="red-button box"
                onClick={() => unfollow(channel.type, channel.channel_name)}
              >
                x
              </button>
            ) : (
              <button
                className="green-button box"
                onClick={() => follow(channel.type, channel.channel_name)}
              >
                +
              </button>
            )}
          </>
        )}
      </div>

      <div className="d-flex flex-row justify-content-center align-items-center">
        {channel.locked && (
          <>
            <div className="altro d-flex flex-row justify-content-center align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-ban"
                viewBox="0 0 16 16"
              >
                <path d="M15 8a6.973 6.973 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
              </svg>
              <div className="cool-font-medium altro">
                {" "}
                &nbsp;BLOCCATO &nbsp;
              </div>
              <div>NON SI PUO SCRIVERE</div>
            </div>
          </>
        )}
      </div>

      {roleUser.map((role) => (
        <>
          <Row
            key={role._id}
            lg={12}
            className="d-flex justify-content-center align-items-center"
          >
            {role.role === 0 &&
              role.channel_name === channel.channel_name &&
              channel.type === "CHANNEL_USERS" && (
                <>
                  <div className="cool-font-medium">
                    RUOLO: <b>IN ATTESA</b>
                    <button className="custom-button ms-2">🕒</button>
                  </div>
                </>
              )}
            {role.role === 1 && role.channel_name === channel.channel_name && (
              <>
                <div className="cool-font-medium">
                  RUOLO: <b>LETTORE</b>
                  <button className="custom-button ms-2">📖</button>
                </div>
              </>
            )}
            {role.role === 2 && role.channel_name === channel.channel_name && (
              <>
                <div className="cool-font-medium">
                  RUOLO: <b>SCRITTORE</b>
                  <button className="custom-button ms-2">✒️</button>
                </div>
              </>
            )}
            {role.role === 3 && role.channel_name === channel.channel_name && (
              <>
                <div className="cool-font-medium">
                  RUOLO: <b>ADMIN</b>
                  <button className="custom-button ms-2">⚔️</button>
                </div>
              </>
            )}
            {role.role === 4 && role.channel_name === channel.channel_name && (
              <>
                <div className="cool-font-medium">
                  RUOLO: <b>OWNER</b>
                  <button className="custom-button ms-2">👑</button>
                </div>
              </>
            )}
          </Row>
        </>
      ))}

      <div>
        <h1 className="cool-font-medium mt-3">
          SQUEALS DI {channel.channel_name}
        </h1>
        <br></br>
      </div>
      {squealsLogger.length === 0 && (
        <>
          <p className="cool-font m-0 p-0 text-wrap">
            NON CI SONO ANCORA SQUEALS
          </p>
        </>
      )}

      {roleUser.map((role) => (
        <>
          <Row className="w-100" key={role._id}>
            {role.role === 0 &&
              squealsLogger.length !== 0 &&
              role.channel_name === channel.channel_name &&
              channel.type === "CHANNEL_USERS" && (
                <>
                  <h1 className="cool-font-medium text-center">
                    SEI IN ATTESA...
                  </h1>
                </>
              )}

            {role.role === 1 &&
              role.channel_name === channel.channel_name &&
              squealsLogger
                .map((squeal) => (
                  <Col lg={12} key={squeal._id} className="mb-4">
                    <Card style={{ height: "100%" }} className="squeal">
                      <Card.Header className="d-flex flex-column justify-content-evenly align-items-center cool-font-details">
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <b>DA:</b>

                            <Link to="/infou" state={squeal.sender}>
                              <button className=" ms-2 custom-button box ">
                                <b>{squeal.sender} </b>

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
                          </div>
                        </div>
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                          <b>PER:</b>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                        <div  className="col-12 d-flex flex-column justify-content-start align-items-start">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                          <div className="cool-font-details">
                            ID:{squeal._id}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center ">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div>
                          <Reactions
                            squeal={squeal._id}
                            reaction={squeal.reaction}
                          />
                        </div>
                        <ShowComment arrayComment={squeal.comments} />
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
                .reverse()}

            {role.role === 2 &&
              role.channel_name === channel.channel_name &&
              squealsLogger
                .map((squeal) => (
                  <Col lg={12} key={squeal._id} className="mb-4">
                    <Card style={{ height: "100%" }} className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <b>DA:</b>

                            <Link to="/infou" state={squeal.sender}>
                              <button className=" ms-2 custom-button box ">
                                <b>{squeal.sender} </b>

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
                          </div>
                        </div>
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                          <b>PER:</b>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                        <div className="col-12 d-flex flex-column justify-content-start align-items-start">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                          <div className="cool-font-details">
                            ID:{squeal._id}
                          </div>
                        </div>
                      </Card.Header>
                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div>
                          <Reactions
                            squeal={squeal._id}
                            reaction={squeal.reaction}
                          />
                        </div>
                        <Comment squeal={squeal._id} />
                        <ShowComment arrayComment={squeal.comments} />
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
                .reverse()}

            {role.role === 3 &&
              role.channel_name === channel.channel_name &&
              squealsLogger
                .map((squeal) => (
                  <Col lg={12} key={squeal._id} className="mb-4">
                    <Card style={{ height: "100%" }} className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <b>DA:</b>

                            <Link to="/infou" state={squeal.sender}>
                              <button className=" ms-2 custom-button box ">
                                <b>{squeal.sender} </b>

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
                          </div>
                        </div>
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                          <b>PER:</b>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                        <div  className="col-12 d-flex flex-column justify-content-start align-items-start">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                          <div className="cool-font-details">
                            ID:{squeal._id}
                          </div>
                        </div>
                      </Card.Header>

                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div>
                          <Reactions
                            squeal={squeal._id}
                            reaction={squeal.reaction}
                          />
                        </div>
                        <Comment squeal={squeal._id} />
                        <ShowComment arrayComment={squeal.comments} />
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
                .reverse()}

            {role.role === 4 &&
              role.channel_name === channel.channel_name &&
              squealsLogger
                .map((squeal) => (
                  <Col lg={12} key={squeal._id} className="mb-5">
                    <Card style={{ height: "100%" }} className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <b>DA:</b>

                            <Link to="/infou" state={squeal.sender}>
                              <button className=" ms-2 custom-button box ">
                                <b>{squeal.sender} </b>

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
                          </div>
                        </div>
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                          <b>PER:</b>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                        <div  className="col-12 d-flex flex-column justify-content-start align-items-start">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                          <div className="cool-font-details">
                            ID:{squeal._id}
                          </div>
                        </div>
                      </Card.Header>

                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div>
                          <Reactions
                            squeal={squeal._id}
                            reaction={squeal.reaction}
                          />
                        </div>
                        <Comment squeal={squeal._id} />
                        <ShowComment arrayComment={squeal.comments} />
                      </Card.Footer>
                    </Card>
                  </Col>
                ))
                .reverse()}
          </Row>
        </>
      ))}

      {channel.type === "CHANNEL_HASHTAG" &&
        squealsLogger.map((squeal) => (
          <Col
            lg={12}
            key={squeal._id}
            className=" d-flex flex-row justify-content-evenly align-items-center m-4"
          >
            <Card style={{ width: "80%" }} className="squeal">
              <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                {" "}
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <b>DA:</b>

                    <Link to="/infou" state={squeal.sender}>
                      <button className=" ms-2 custom-button box ">
                        <b>{squeal.sender} </b>

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
                  </div>
                </div>
                <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                  <b>PER:</b>
                  <ShowDest arrayDest={squeal.destinations} />
                </div>
                <div  className="col-12 d-flex flex-column justify-content-start align-items-start">
                  <TypeSqueal typeSqueal={squeal.message_type} />
                  <div className="cool-font-details"> ID:{squeal._id}</div>
                </div>
              </Card.Header>

              <Card.Body className="mb-2 d-flex flex-col justify-content-center align-items-center">
                <SquealContent
                  content={squeal.content}
                  type={squeal.message_type}
                  id={squeal._id}
                />
              </Card.Body>
              <Card.Footer>
                <Comment squeal={squeal._id} />
                <ShowComment arrayComment={squeal.comments} />
              </Card.Footer>
            </Card>
          </Col>
        ))}

      {channel.type === "CHANNEL_OFFICIAL" &&
        squealsLogger.map((squeal) => (
          <Col
            lg={12}
            key={squeal._id}
            className="d-flex flex-row justify-content-evenly align-items-center m-4"
          >
            <Card style={{ height: "80%" }} className="squeal mb-2">
              <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                {" "}
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <b>DA:</b>

                    <Link to="/infou" state={squeal.sender}>
                      <button className=" ms-2 custom-button box ">
                        <b>{squeal.sender} </b>

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
                  </div>
                </div>
                <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                  <b>PER:</b>
                  <ShowDest arrayDest={squeal.destinations} />
                </div>
                <div  className="col-12 d-flex flex-column justify-content-start align-items-start">
                  <TypeSqueal typeSqueal={squeal.message_type} />
                  <div className="cool-font-details"> ID:{squeal._id}</div>
                </div>
              </Card.Header>

              <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                <SquealContent
                  content={squeal.content}
                  type={squeal.message_type}
                  id={squeal._id}
                />
              </Card.Body>
              <Card.Footer>
                <div>
                  <Reactions squeal={squeal._id} reaction={squeal.reaction} />
                </div>
                {userGlobal.username !== "" && (
                  <>
                    <Comment squeal={squeal._id} />
                    <ShowComment arrayComment={squeal.comments} />
                  </>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
    </div>
  );
}

export default InfoChannel;

/*
  //GET /channel/{type}/{channel_name}    channel info PRENDO LE INFO da useLocation
  const [info, setInfo] = useState([]);
  const getChTypeName = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Channel info:", data);
        setInfo(data);
      })
      .catch((error) => {
        console.error("Failed to get channel info, errore:", error);
      });
  };
*/
