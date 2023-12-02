import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Search from "./Search";
import Footer from "./Footer";
import ChannelForm from "./ChannelForm";
import AudioPlayer from "./AudioPlayer";

import "../css/LoginForm.css";
import "react-toastify/dist/ReactToastify.css";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

function Channels() {
  const { userGlobal, setUserGlobal } = useUserContext();
  //console.log("cercatooooooooooooo", userGlobal.username);
  //console.log("viiiiiiiiiiiiiiiiiiiiiiiiiiiip", userGlobal.vip);

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

  //GET /channel    list of channels TAGS ------------------------------------------------------------------------------------------------------------
  const [tagChannel, setTagChannels] = useState([]);
  const [userChannel, setUserChannels] = useState([]);
  const [officialChannel, setOfficialChannels] = useState([]);

  async function getTagChannels() {
    changeClickTag();
    if (clickTag) {
      try {
        const uri = `${ReactConfig.base_url_requests}/channel/CHANNEL_HASHTAG`;
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
    }
    console.log("LISTA CANALI TAGS", tagChannel);
  }

  ///GET /channel    list of channels USERS-------------------------------------------------------------
  async function getUserChannels() {
    changeClickUser();
    if (clickUser) {
      try {
        const uri = `${ReactConfig.base_url_requests}/channel/CHANNEL_USERS`;

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
    }
    console.log("LISTA CANALI USER", userChannel);
  }

  ///GET /channel    list of channels OFFICIAL-------------------------------------------------------
  async function getOfficialChannels() {
    changeClickOfficial();
    if (clickOfficial) {
      try {
        const uri = `${ReactConfig.base_url_requests}/channel/CHANNEL_OFFICIAL`;
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

  //PRIVATE BUTTON
  const [clickOffPrivate, setClickOffPrivate] = useState(false);
  const changeClickOffPrivate = () => {
    setClickOffPrivate(!clickOffPrivate);
  };
  const [clickUserPrivate, setClicUserPrivate] = useState(false);
  const changeClickUserPrivate = () => {
    setClicUserPrivate(!clickUserPrivate);
  };
  const [clickTagPrivate, setClicTagPrivate] = useState(false);
  const changeClicTagPrivate = () => {
    setClicTagPrivate(!clickTagPrivate);
  };

  //PUBLIC BUTTON
  const [clickOffPublic, setClickOffPublic] = useState(false);
  const changeClickOffPublic = () => {
    setClickOffPublic(!clickOffPublic);
  };
  const [clickUserPublic, setClicUserPublic] = useState(false);
  const changeClickUserPublic = () => {
    setClicUserPublic(!clickUserPublic);
  };
  const [clickTagPublic, setClicTagPublic] = useState(false);
  const changeClicTagPublic = () => {
    setClicTagPublic(!clickTagPublic);
  };

  return (
    <div>
      <div className="container-flex">
        <div className="row" onLoad={getUserData}>
          <div className="col-12 mt-5">
            <AudioPlayer />
            <div>
              <div>
                <p>orderBy</p>
                <div>
                  <button className="custom-button box mb-2">PRIVATI</button>

                  <button className="custom-button box mb-2">PUBBLICI</button>
                </div>
                <div>
                  <button className="custom-button box mb-2">NOME</button>
                </div>

                <div>
                  <button
                    className="custom-button box mb-2"
                    onClick={getOfficialChannels}
                  >
                    UFFICIALI
                  </button>
                  <Container fluide>
                    {clickOfficial && (
                      <>
                        {officialChannel.map((o) => (
                          <Col lg={12}>
                            <Card
                              style={{ height: "100%" }}
                              key={o.id}
                              className="squeal mb-4"
                            >
                              <Card.Header className="d-flex justify-content-center align-items-center"></Card.Header>
                              <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                                {o.channel_name}
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </>
                    )}
                  </Container>

                  <button
                    className="custom-button box mb-2"
                    onClick={getUserChannels}
                  >
                    UTENTI
                  </button>
                  <Container fluide>
                    {clickUser && (
                      <>
                        {userChannel.map((u) => (
                          <Card
                            style={{ height: "100%" }}
                            key={u.id}
                            className="squeal mb-4"
                          >
                            <Card.Header className="d-flex justify-content-center align-items-center"></Card.Header>
                            <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                              {u.channel_name}
                            </Card.Body>
                          </Card>
                        ))}
                      </>
                    )}
                  </Container>

                  <button
                    className="custom-button box mb-2"
                    onClick={getTagChannels}
                  >
                    TAG
                  </button>
                  <Container fluide>
                    {clickTag && (
                      <>
                        {tagChannel.map((t) => (
                          <Card
                            style={{ height: "100%" }}
                            key={t.id}
                            className="squeal mb-4"
                          >
                            <Card.Header className="d-flex justify-content-center align-items-center"></Card.Header>
                            <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                              {t.channel_name}
                            </Card.Body>
                          </Card>
                        ))}
                      </>
                    )}
                  </Container>
                </div>

                <p>orderBy</p>
                <div>
                  <button className="custom-button box">ASC</button>
                  <button className="custom-button box">DECR</button>
                </div>
              </div>
              <ChannelForm />
              <Search />
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center ms-1 me-1 mb-5 w-100">
          <h3>TODO:</h3>
          <ul className="list-group col-md-4">
            <li className="list-group-item list">
              cambia bottone quando seguito
            </li>
            <li className="list-group-item list">
              GESTIONE RUOLI: PATCH new_role
            </li>
            <li className="list-group-item list">CREARE CANALI UFFICIALI</li>
            <li className="list-group-item list">CREARE 3 CANALI API</li>
            <li className="list-group-item list">
              URL: limit, offset, orerBy, orderDir
            </li>
            <li className="list-group-item list">GET #</li>{" "}
            <li className="list-group-item list">
              criterio squeals appartenenza canale
            </li>
            <li className="list-group-item list">suono!</li>
            <li className="list-group-item list">canali bloccati???</li>
            <li className="list-group-item list">canali popolarità??</li>
            <li className="list-group-item list">canali silenziabili??</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;

/*
<Container fluide>
  {channels.map((channel) => (
    <Col lg={12}>
      <Card style={{ height: "100%" }} key={channel.id} className="squeal mb-4">
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
        </Card.Header>
        <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center"></Card.Body>
      </Card>
    </Col>
  ))}
</Container>;

*/
