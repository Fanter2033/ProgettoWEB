import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import ChangeNameChannel from "./ChangeNameChannel";
import ChannelDeleteModal from "./ChannelDeleteModal";

import "../css/App.css";
import { Container, Card, Col, Row } from "react-bootstrap";

//! PUT dei canali???

function InfoChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  //!{type}/{channel_name}
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

  //!se sei il proprietario
  //una variabile booleana
  const isOwner = channel.owner === userGlobal.username;

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

  console.log("ownerrrrrrrrrrrrrrrrr " + channel.owner);
  console.log("userrrrrrrrrrrrrrrrrrr " + userGlobal.username);

  //TODO: PATCH /channel/{type}/{channel_name}  follow channel
  const follow = () => {
    alert("da farrrrrrrrrrrrrrrrrr");
    const data = {
      channel: {
        name: channel.channel_name,
        type: "CHANNEL_USERS",
        private: false,
      },
    };

    const url = `${ReactConfig.base_url_requests}/${channel.type}/${channel.channel_name}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //creation ok
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

  //TODO: PATCH /channel/{type}/{channel_name}/{username}   change role user
  const changeRoles = () => {
    alert("da farrrrrrrrrrrrrrrrrr PT2");
  };

  return (
    <div>
      <div>
        <button className="user_button box" onClick={follow}>
          Segui
        </button>
        <button
          id="logout-button"
          className="box"
          onClick={() => window.history.back()}
        >
          Torna Indietro
        </button>
      </div>
      {isOwner && (
        <div>
          <h2>Per il creatore del canale</h2>

          <ChangeNameChannel />

          <ChannelDeleteModal />
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
          Channel Name: {channel.channel_name}
        </h3>
        <p className="cool-font-small">Type: {channel.type}</p>
        <p className="cool-font-small">Private: {channel.private.toString()}</p>
        <p className="cool-font-small">Owner: {channel.owner}</p>
        <p className="cool-font-small">Subscribers: {channel.subscribers}</p>
        <p className="cool-font-small">Posts: {channel.posts}</p>
      </div>
      <div>
        <h1 className="cool-font">Squeals</h1>
        <br></br>
      </div>
      <div>
        <h3>Follower:</h3>
        <Container>
          <Row>
            {following.map((user) => (
              <Col lg={12} key={user.id} className="mb-4">
                <Card className="w-100">
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

      <div>
        <button className="user_button box" onClick={changeRoles}>
          Cambia ruoli?
        </button>

        <h3>Roles?????</h3>
        <Container>
          <Row>
            {roles.map((user) => (
              <Col lg={12} key={user.id} className="mb-4">
                <Card className="w-100">
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
  );
}

export default InfoChannel;
