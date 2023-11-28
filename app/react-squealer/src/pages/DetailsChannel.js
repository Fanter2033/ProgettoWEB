import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { useUserContext } from "../config/UserContext";
import ReactConfig from "../config/ReactConfig";

import ChangeNameChannel from "./ChangeNameChannel";
import ChannelDeleteModal from "./ChannelDeleteModal";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

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

  //GET /channel/{type}/{channel_name}/roles/0 || 1 || 2 || 3 || 4    roles following a ch
  const [roles, setRoles] = useState([]);
  const getAllRoles = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/roles/${channel.roles}`;
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

  //!se iscritto
  //TODO: GET /channel/{type}/{channel_name}/users/{username}/     role of user
  const [myRole, setMyRole] = useState([]);
  const getMyRole = () => {
    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}/users/${userGlobal.username}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Get the role of the user:", data);
        setMyRole(data);
      })
      .catch((error) => {
        console.error("Faillllllll, errore:", error);
      });
  };

  //TODO: PATCH /channel/{type}/{channel_name}/{username}   change role user
  async function changeRoles() {
    const uri = `${ReactConfig.base_url_requests}/channel/${channel.channel_name}/${userGlobal.username}`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          console.log("PATCH OK");
        } else {
          console.error("PATCH ROLE ERROR", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }
  //console.log();

  useEffect(() => {
    //const intervalId1 = setInterval(getChTypeName, 5000);
    const intervalId2 = setInterval(getChTypeNameUsers, 5000);
    const intervalId4 = setInterval(getAllRoles, 5000);

    //getChTypeName();
    getChTypeNameUsers();
    getAllRoles();
    //se iscritto
    const intervalId3 = setInterval(getMyRole, 5000);

    //clearInterval(intervalId1);
    return () => {
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="row d-flex flex-row justify-content-center align-items-content">
          <p>Dettagli</p>
          <button
            className="red-button box w-25"
            onClick={() => window.history.back()}
          >
            &lt;-
          </button>
        </div>
        {isOwner && (
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
              <button className="user_button box" onClick={changeRoles}>
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
        <div
          style={{
            padding: "3em",
            margin: "0",
            borderRadius: "5px",
          }}
        >
          <h3 className="cool-font-medium">
            Nome Canale: {channel.channel_name}
          </h3>
          <p className="cool-font-small">Tipo: {channel.type}</p>
          <p className="cool-font-small">
            Private: {channel.private.toString()}
          </p>
          <p className="cool-font-small">Proprietario: {channel.owner}</p>
          <p className="cool-font-small">Num Squeals: {channel.posts}</p>
        </div>

        <div>
          <h3>Iscritti: {channel.subscribers}</h3>

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
                    </Card.Body>
                  </Card>
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
