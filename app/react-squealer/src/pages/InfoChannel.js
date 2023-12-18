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

import { Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import notification from ".//media/message.mp3";

function InfoChannel() {
  const location = useLocation();

  const [channel, setChannel] = useState(location.state);
  console.log(channel);
  let [currentUser, setCurrentUser] = useState({});

  /*
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
  */

  //GET WHO AM I--------------------------------------------------------------------------------
  async function whoAmI() {
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Tutto ok, io sono:", data);
        setCurrentUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    logPast();
    getRoles();
  }, [currentUser]);

  const { userGlobal, setUserGlobal } = useUserContext();

  //GET /user/{username}/roles/ LISTA CANALI SEGUITI E IL REALATIVO RUOLO DELL'UTENTE
  const [roleUser, setRoleUser] = useState([]);
  async function getRoles() {
    if (
      typeof currentUser === "undefined" ||
      typeof currentUser.username === "undefined"
    )
      return;
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${currentUser.username}/roles/`;
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
    const uri = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${currentUser.username}`;
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
    if (channel.type === "CHANNEL_USERS")
      if (
        typeof currentUser === "undefined" ||
        typeof currentUser.username === "undefined"
      )
        return;

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
    whoAmI();

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
      <div className="d-flex flex-row align-items-center justify-content-evenly align-items-center pt-3 pb-3 ">
        <Link to={ReactConfig.pathFunction("/details")} state={channel}>
          <button
            className="yellow-button box "
            aria-label="clicca se vuoi avere informazioni sul canale"
          >
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
          aria-label="clicca se vuoi tornare alla pagina precedente"
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
                arial-label="you are subscsribed, click to unsubscribe"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-person-fill-slash"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4" />
                </svg>
              </button>
            ) : (
              <button
                className="green-button box"
                onClick={() => follow(channel.type, channel.channel_name)}
                arial-label="you are not subscsribed, click to subscribe"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-person-fill-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      <div className="d-flex flex-row justify-content-center align-items-center">
        {channel.locked && (
          <>
            <div className="altro d-flex flex-row justify-content-center align-items-center cool-font-link">
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
          SQUEALS DI: {channel.channel_name}
        </h1>
      </div>

      {squealsLogger.length === 0 && (
        <>
          <p className="cool-font m-0 p-0 text-wrap">
            NON CI SONO ANCORA SQUEALS
          </p>
        </>
      )}

      {channel.type === "CHANNEL_USERS" &&
        channel.private === false &&
        squealsLogger.map((squeal) => (
          <Col key={squeal._id} className="m-4">
            <Card className="squeal">
              <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                {" "}
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <span className="cool-medium">DA:</span>

                    <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                      <button
                        className=" ms-2 custom-button box "
                        aria-label="clicca se vuoi avere informazioni sull'utente"
                      >
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
                <div className="col-12 d-flex flex-row justify-content-start align-items-center mt-1">
                  <span className="cool-medium">PER:</span>
                  <ShowDest arrayDest={squeal.destinations} />
                </div>
              </Card.Header>

              <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                <SquealContent
                  content={squeal.content}
                  type={squeal.message_type}
                  id={squeal._id}
                />
              </Card.Body>
              <Card.Footer>
                <div className="col-12 d-flex flex-row justify-content-center align-items-start m-1">
                  <TypeSqueal typeSqueal={squeal.message_type} />
                </div>
                <Comment squeal={squeal._id} />
                <ShowComment arrayComment={squeal.comments} />
              </Card.Footer>
            </Card>
          </Col>
        ))}

      {roleUser.map((role) => (
        <>
          <Row className="w-100" key={role._id}>
            {role.role === 0 &&
              squealsLogger.length !== 0 &&
              role.channel_name === channel.channel_name &&
              channel.type === "CHANNEL_USERS" && (
                <>
                  <h1 className="cool-font-medium text-center">
                    SEI IN ATTESA CHE IL CREATORE O UN ADMIN ACCETTINO LA TUA
                    RICHIESTA...
                  </h1>
                </>
              )}

            {role.role === 1 &&
              role.channel_name === channel.channel_name &&
              squealsLogger
                .map((squeal) => (
                  <Col key={squeal._id} className="m-4">
                    <Card className="squeal">
                      <Card.Header className="d-flex flex-column justify-content-evenly align-items-center cool-font-details">
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <span className="cool-medium">DA:</span>

                            <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                              <button
                                className=" ms-2 custom-button box "
                                aria-label="clicca se vuoi avere informazioni sull'utente"
                              >
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
                          <span className="cool-medium">PER:</span>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                      </Card.Header>
                      <Card.Body className="d-flex flex-col justify-content-center align-items-center ">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="row cool-medium d-flex">
                          <div className="col-12">
                            <button className="blue-button p-1 me-1">
                              👁️ {squeal.critical_mass / 0.25}
                            </button>
                            <button className="green-button p-1 ">
                              👍🏻 {squeal.positive_value}
                            </button>
                            <button className="red-button p-1 ms-1">
                              👎🏻 {squeal.negative_value}
                            </button>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center align-items-start m-1">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                        </div>
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
                  <Col key={squeal._id} className="m-4">
                    <Card className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center cool-medium">
                          <div>
                            <span>DA:</span>

                            <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                              <button
                                className=" ms-2 custom-button box "
                                aria-label="clicca se vuoi avere informazioni sull'utente"
                              >
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
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center cool-medium mt-1">
                          <span>PER:</span>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                      </Card.Header>
                      <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="row cool-medium d-flex">
                          <div className="col-12">
                            <button className="blue-button p-1 me-1">
                              👁️ {squeal.critical_mass / 0.25}
                            </button>
                            <button className="green-button p-1 ">
                              👍🏻 {squeal.positive_value}
                            </button>
                            <button className="red-button p-1 ms-1">
                              👎🏻 {squeal.negative_value}
                            </button>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center align-items-start m-2">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                        </div>
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
                  <Col key={squeal._id} className="m-4">
                    <Card className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                          <div>
                            <span className="cool-medium">DA:</span>

                            <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                              <button
                                className=" ms-2 custom-button box "
                                aria-label="clicca se vuoi avere informazioni sull'utente"
                              >
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
                        <div className="col-12 d-flex flex-row justify-content-start align-items-center mt-1">
                          <span className="cool-medium">PER:</span>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                      </Card.Header>

                      <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="row cool-medium d-flex">
                          <div className="col-12">
                            <button className="blue-button p-1 me-1">
                              👁️ {squeal.critical_mass / 0.25}
                            </button>
                            <button className="green-button p-1 ">
                              👍🏻 {squeal.positive_value}
                            </button>
                            <button className="red-button p-1 ms-1">
                              👎🏻 {squeal.negative_value}
                            </button>
                          </div>
                        </div>
                        <div className="col-12 d-flex flex-row justify-content-center align-items-start m-2">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                        </div>

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
                  <Col key={squeal._id} className="m-4">
                    <Card className="squeal">
                      <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                        {" "}
                        <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                          <div>
                            <span className="cool-medium">DA:</span>

                            <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                              <button
                                className=" ms-2 custom-button box "
                                aria-label="clicca se vuoi avere informazioni sull'utente"
                              >
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
                        <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-1">
                          <span className="cool-medium">PER:</span>
                          <ShowDest arrayDest={squeal.destinations} />
                        </div>
                      </Card.Header>

                      <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <div className="row cool-medium d-flex">
                          <div className="col-12">
                            <button className="blue-button p-1 me-1">
                              👁️ {squeal.critical_mass / 0.25}
                            </button>
                            <button className="green-button p-1 ">
                              👍🏻 {squeal.positive_value}
                            </button>
                            <button className="red-button p-1 ms-1">
                              👎🏻 {squeal.negative_value}
                            </button>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center align-items-start  mt-1">
                          <TypeSqueal typeSqueal={squeal.message_type} />
                        </div>
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
          <Col key={squeal._id} className="m-4">
            <Card className="squeal">
              <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                {" "}
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <span className="cool-medium">DA:</span>

                    <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                      <button
                        className=" ms-2 custom-button box "
                        aria-label="clicca se vuoi avere informazioni sull'utente"
                      >
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
                <div className="col-12 d-flex flex-row justify-content-start align-items-center mt-1">
                  <span className="cool-medium">PER:</span>
                  <ShowDest arrayDest={squeal.destinations} />
                </div>
              </Card.Header>

              <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                <SquealContent
                  content={squeal.content}
                  type={squeal.message_type}
                  id={squeal._id}
                />
              </Card.Body>
              <Card.Footer>
                <div className="col-12 d-flex flex-row justify-content-center align-items-start m-1">
                  <TypeSqueal typeSqueal={squeal.message_type} />
                </div>
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
            <Card className="squeal">
              <Card.Header className="row d-flex flex-column justify-content-evenly align-items-center">
                {" "}
                <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <span className="cool-medium">DA:</span>

                    <Link to={ReactConfig.pathFunction("/infou")} state={squeal.sender}>
                      <button
                        className=" ms-2 custom-button box "
                        aria-label="clicca se vuoi avere informazioni sull'utente"
                      >
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
                <div className="col-12 d-flex flex-row justify-content-start align-items-center mt-1">
                  <span className="cool-medium">PER:</span>
                  <ShowDest arrayDest={squeal.destinations} />
                </div>
              </Card.Header>

              <Card.Body className="d-flex flex-col justify-content-center align-items-center">
                <SquealContent
                  content={squeal.content}
                  type={squeal.message_type}
                  id={squeal._id}
                />
              </Card.Body>
              <Card.Footer>
                <div className="row cool-medium d-flex">
                  <div className="col-12">
                    <button className="blue-button p-1 me-1">
                      👁️ {squeal.critical_mass / 0.25}
                    </button>
                    <button className="green-button p-1 ">
                      👍🏻 {squeal.positive_value}
                    </button>
                    <button className="red-button p-1 ms-1">
                      👎🏻 {squeal.negative_value}
                    </button>
                  </div>
                </div>
                <div className="col-12 d-flex flex-row justify-content-center align-items-start m-2">
                  <TypeSqueal typeSqueal={squeal.message_type} />
                </div>
                <div>
                  <Reactions squeal={squeal._id} reaction={squeal.reaction} />
                </div>
                {typeof currentUser !== 'undefined' &&
                    typeof currentUser.username !== 'undefined' &&
                  currentUser.username !== "" && (
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
