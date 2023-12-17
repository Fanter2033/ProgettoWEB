import React, { useState, useEffect } from "react";
import {useLocation, Link, useNavigate, redirect} from "react-router-dom";

import { useUserContext } from "../config/UserContext";
import ReactConfig from "../config/ReactConfig";

import ChangeNameChannel from "./ChangeNameChannel";
import ChannelDeleteModal from "./ChannelDeleteModal";
import ChangeRoleModal from "./ChangeRoleModal";
import MatchRole from "./MatchRole";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";
import {toast} from "react-toastify";

function DetailsChannel() {
  const location = useLocation();
  const navigate = useNavigate();

  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();
  const [localUser, setLocalUser] = useState({});

  //GET /channel/{type}/{channel_name}/users/     list of following
  const [following, setFollowing] = useState([]);

  const notifyCannotChange = () =>
      toast.error("Non puoi cambiare il creatore", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

  const subscribersList = () => {
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

  //GET /user/{username}/roles/ LISTA CANALI SEGUITI E IL REALATIVO RUOLO DELL'UTENTE
  const [roleUser, setRoleUser] = useState([]);
  async function getRoles() {
    try {
      if(typeof localUser === 'undefined' || typeof localUser.username === 'undefined')
        return;
      const uri = `${ReactConfig.base_url_requests}/user/${localUser.username}/roles/`;
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
    console.log("Successo nella richiesta dei ruoli UTENTE", roleUser);
  }

  const [roles0, setRoles0] = useState([]);
  const [roles1, setRoles1] = useState([]);
  const [roles2, setRoles2] = useState([]);
  const [roles3, setRoles3] = useState([]);
  const [roles4, setRoles4] = useState([]);

  const fetchData = async (channelName, roleNumber) => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channelName}/roles/${roleNumber}`;

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

  async function whoAmI() {
    //GET WHO AM I--------------------------------------------------------------------------------
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            redirect('./channels');
          }
        })
        .then((data) => {
          console.log('DATAAAAAAA', data);
          setLocalUser(data);
        })
        .catch((error) => {
          console.error(error);
        });
  }

  useEffect(() => {

    console.log('HELLO GUYS!!!', channel);
    whoAmI();
    if(channel.channel_name === '' || typeof channel === 'undefined' || typeof channel.channel_name === 'undefined'){
      navigate('./channels');
    }

    fetchData(channel.channel_name, 0);
    fetchData(channel.channel_name, 1);
    fetchData(channel.channel_name, 2);
    fetchData(channel.channel_name, 3);
    fetchData(channel.channel_name, 4);
  }, []);

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

  useEffect(() => {
    getRoles();
    subscribersList();
  }, [localUser]);

  //Role modalssssssss
  const [newRoleModal, setNewRoleModal] = useState(false);
  const openRoleModal = () => {
    setNewRoleModal(true);
  };
  const closeRoleModal = () => {
    setNewRoleModal(false);
  };

  const [isInputPresent, setIsInputPresent] = useState(false);

  // funzione di callback per ricevere il risultato dalla componente figlia
  const handleInputPresence = (result) => {
    setIsInputPresent(result);
  };

  return (
    <>
      <div className="container pt-2 pb-5">
        <div className="row d-flex flex-row justify-content-center align-items-content mt-3">
          <button
            className="red-button box w-25"
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
                  &nbsp;BLOCCATO&nbsp;
                </div>
                <div>NON SI PUO SCRIVERE</div>
              </div>
            </>
          )}
        </div>

        <Card className="offers mt-3">
          <Card.Header>
            <h3 className="cool-font-medium">
              NOME CANALE: {channel.channel_name}
            </h3>
          </Card.Header>

          <Card.Body>
            {channel.channel_type === "CHANNEL_OFFICIAL" && (
              <>
                <h3 className="cool-font-medium">
                  DESCRIZIONE: {channel.description}
                </h3>
              </>
            )}

            {channel.type === "CHANNEL_USERS" && (
              <p className="cool-font-small mb-0">CREATORE: {channel.owner}</p>
            )}

            <p className="cool-font-small mb-0">
              NUMERO SQUEALS: {channel.posts}
            </p>
          </Card.Body>

          <Card.Footer>
            <div>
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
                      className="currentColor"
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

              {channel.type === "CHANNEL_USERS" && (
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
              )}
            </div>
          </Card.Footer>
        </Card>

        { (typeof localUser !== 'undefined' && typeof localUser.username !== 'undefined') &&
          channel.owner === localUser.username &&
          channel.type === "CHANNEL_USERS" && (
            <div className="row">
              <h2 className="cool-font-medium mt-3">
                PER IL CREATORE DEL CANALE
              </h2>

              <div className="">
                <ChangeNameChannel />{" "}
              </div>
              <div className="">
                {" "}
                <ChannelDeleteModal />
              </div>
            </div>
          )}

        {channel.type === "CHANNEL_USERS" && (
          <>
            <div className="mt-3 mb-5">
              <h3 className="cool-font-medium">
                ISCRITTI: {channel.subscribers}
              </h3>

              <Container>
                <Row>
                  {following.map((user, index) => (
                    <Col lg={12} key={index} className="mb-4">
                      <Card className="w-100 squeal">
                        {" "}
                        <Card.Body className="mb-4 d-flex flex-column justify-content-center align-items-center">
                          <Link to={ReactConfig.pathFunction("/infou")} state={user}>
                            <button className="ms-4 me-4 custom-button box mb-3" aria-label="clicca se vuoi avere informazioni sull'utente">
                              <b> {user} </b>

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
                          {(typeof localUser !== 'undefined' && typeof localUser.username !== 'undefined') &&
                            roles3.includes(localUser.username) && (
                            <>
                              <MatchRole
                                inputString={user}
                                array1={roles0}
                                array2={roles1}
                                array3={roles2}
                                array4={roles3}
                                array5={roles4}
                                name={channel.channel_name}
                                type={channel.type}
                                onInputPresenceChange={handleInputPresence}
                              />
                            </>
                          )}
                          {roles4.includes(localUser.username) && (
                            <>
                              <MatchRole
                                inputString={user}
                                array1={roles0}
                                array2={roles1}
                                array3={roles2}
                                array4={roles3}
                                array5={roles4}
                                name={channel.channel_name}
                                type={channel.type}
                                onInputPresenceChange={handleInputPresence}
                              />
                            </>
                          )}
                        </Card.Body>
                      </Card>
                      <ChangeRoleModal
                        closeRole={closeRoleModal}
                        newRoleModel={newRoleModal}
                        username={user}
                        channel={channel.type}
                        notify={notifyCannotChange}
                      />
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DetailsChannel;
