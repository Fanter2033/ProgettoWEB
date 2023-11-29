import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { useUserContext } from "../config/UserContext";
import ReactConfig from "../config/ReactConfig";

import ChangeNameChannel from "./ChangeNameChannel";
import ChannelDeleteModal from "./ChannelDeleteModal";
import ChangeRoleModal from "./ChangeRoleModal";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";

function DetailsChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();
  //!se sei il proprietario
  //una variabile booleana
  const isOwner = channel.owner === userGlobal.username;

  //!{type}/{channel_name} fetch
  //GET /channel/{type}/{channel_name}/users/     list of following
  const [following, setFollowing] = useState([]);
  const getChTypeNameUsers = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Following of a channel:", data);
        setFollowing(data.content);
      })
      .catch((error) => {
        console.error("Failed to get the following, errore:", error);
      });
  };

  const [roles0, setRoles0] = useState([]);
  const [roles1, setRoles1] = useState([]);
  const [roles2, setRoles2] = useState([]);
  const [roles3, setRoles3] = useState([]);
  const [roles4, setRoles4] = useState([]);

  useEffect(() => {
    /*
    const fetchData = async (channelType, channelName, roleNumber) => {
      const url = `${ReactConfig.base_url_requests}/channel/${channelType}/${channelName}/roles/${roleNumber}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(`Get roles for number ${roleNumber}:`, data);

        if (roleNumber === 0) {
          setRoles0(data.content);
        } else if (roleNumber === 1) {
          setRoles1(data.content);
        } else if (roleNumber === 2) {
          setRoles2(data.content);
        } else if (roleNumber === 3) {
          setRoles3(data.content);
        } else if (roleNumber === 4) {
          setRoles4(data.content);
        }
      } catch (error) {
        console.error(
          `Failed to get roles for number ${roleNumber}, error:`,
          error
        );
      }
    };
    fetchData(channel.type, channel.channel_name, 0);
    fetchData(channel.type, channel.channel_name, 1);
    fetchData(channel.type, channel.channel_name, 2);
    fetchData(channel.type, channel.channel_name, 3);
    fetchData(channel.type, channel.channel_name, 4);
    */
  }, [channel.type, channel.channel_name]);

  console.log(
    "zzzzzzzzzzzzzz",
    "0",
    roles0,
    "1",
    roles1,
    "2",
    roles2,
    "3",
    roles3,
    "4",
    roles4
  );

  //GET /channel/{type}/{channel_name}/roles/0 || 1 || 2 || 3 || 4    roles following a ch
  const [roles, setRoles] = useState([]);
  const getAllRoles = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/roles/4`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get all the roles:", data);
        setRoles(data.content);
      })
      .catch((error) => {
        console.error("Failed to get all the roles, errore:", error);
      });
  };
  //console.log(roles, "AAAAAAAAAAAAAA");

  useEffect(() => {
    //const intervalId1 = setInterval(getChTypeName, 5000);
    //const intervalId2 = setInterval(getChTypeNameUsers, 5000);
    const intervalId4 = setInterval(getAllRoles, 5000);

    //getChTypeName();
    getChTypeNameUsers();
    getAllRoles();
    //se iscritto

    //clearInterval(intervalId1);
    return () => {
      //clearInterval(intervalId2);
      clearInterval(intervalId4);
    };
  }, []);

  //Role modalssssssss
  const [newRoleModal, setNewRoleModal] = useState(false);
  const openRoleModal = () => {
    setNewRoleModal(true);
  };
  const closeRoleModal = () => {
    setNewRoleModal(false);
  };

  return (
    <>
      <div className="container">
        <div className="row d-flex flex-row justify-content-center align-items-content">
          <p>Dettagli</p>
          <button
            className="red-button box w-25"
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
        </div>

        <div
          style={{
            padding: "3em",
            margin: "0",
            borderRadius: "5px",
          }}
        >
          <h3 className="cool-font-medium">
            NOME CANALE: {channel.channel_name}
          </h3>
          <p className="cool-font-small mb-0">CREATORE: {channel.owner}</p>
          <p className="cool-font-small mb-0">
            NUMERO SQUEALS: {channel.posts}
          </p>
          <div className="d-flex flex-row justify-content-center align-items-center cool-font-small">
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

          <div className="d-flex flex-row justify-content-center align-items-center cool-font-small">
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
        </div>

        <button className="ms-4 me-4 custom-button box">
          SE OWNER O ADMIN CAMBIA RUOLO UTENTI
        </button>

        <h3>Roles for TAG_CH: LETTORI</h3>
        <h3>Roles for OFF_CH: SCRITTORI</h3>
        <h3>Roles change ONLY for USER_CH</h3>
        <button className="ms-4 me-4 custom-button box">
          SE USER PRIVATO: UTENTI IN ATTESA
        </button>
        <button className="ms-4 me-4 custom-button box">
          SE USER PUBBLICO: UTENTE SCRITTORE
        </button>
        <p>Ruoli per il numero 0: IN ATTESA {JSON.stringify(roles0)}</p>
        <p>Ruoli per il numero 1: LETTORI {JSON.stringify(roles1)}</p>
        <p>Ruoli per il numero 2: SCRITTORI {JSON.stringify(roles2)}</p>
        <p>Ruoli per il numero 3: ADMIN{JSON.stringify(roles3)}</p>
        <p>Ruoli per il numero 4: CREATORE{JSON.stringify(roles4)}</p>

        {channel.owner === userGlobal.username && (
          <div className="row">
            <h2>Per il creatore del canale</h2>

            <div className="row">
              <ChangeNameChannel />{" "}
            </div>
            <div className="row">
              {" "}
              <ChannelDeleteModal />
            </div>
            <div>
              <button className="user_button box">
                Cambia ruoli follower?
              </button>
              <div className="row d-flex justify-content-center ms-1 me-1 mb-5">
                <h3>CHANNEL ROLES:</h3>
                <ul className="list-group col-md-4">
                  <li className="list-group-item list">OWNER = 4</li>
                  <li className="list-group-item list">ADMIN = 3</li>
                  <li className="list-group-item list">WRITE = 2</li>
                  <li className="list-group-item list">READ = 1</li>
                  <li className="list-group-item list">WAITING_ACCEPT = 0</li>
                </ul>
              </div>

              <h3>Roles?????</h3>
              <Container>
                <Row>
                  {roles.map((user) => (
                    <Col lg={12} key={user.id} className="mb-4">
                      <Card className="w-100 squeal">
                        {" "}
                        <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                          <div>{user}</div>
                          <Link to="/infou" state={user}>
                            <button className="ms-4 me-4 custom-button box">
                              Info
                            </button>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          </div>
        )}
        <div className="mt-3">
          <h3>ISCRITTI: {channel.subscribers}</h3>

          <Container>
            <Row>
              {following.map((user) => (
                <Col lg={12} key={user.id} className="mb-4">
                  <Card className="w-100 squeal">
                    {" "}
                    <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                      <div>{user}</div>
                      <Link to="/infou" state={user}>
                        <button className="ms-4 me-4 custom-button box">
                          Info
                        </button>
                      </Link>
                      {isOwner && (
                        <>
                          <div>
                            <button
                              className="custom-button box"
                              onClick={openRoleModal}
                            >
                              RUOLO
                            </button>
                          </div>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                  <ChangeRoleModal
                    closeRole={closeRoleModal}
                    newRoleModel={newRoleModal}
                    username={user}
                    channel={channel.type}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}

export default DetailsChannel;
