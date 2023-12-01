import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import Reactions from "./Reactions";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import squeal_logo from "./media/icone/Nav_logo.png";

//! PUT dei canali???
function InfoChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  //TODO: PATCH /channel/{type}/{channel_name}  follow channel
  const follow = () => {
    const data = {
      channel: {
        name: channel.channel_name,
        type: channel.channel_type,
        private: channel.private,
      },
    };

    const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
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

  //GET /utils/squeals/{channel_type}/{channel_name}--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function logPast() {
    console.log("aaaaaaaaaaaaaaaa", channel.channel_name);
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

      console.log(result);
      if (result.ok) {
        let json = await result.json();
        setSquealsLogger(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("LOGGERRRRRRRRRRRRRR", squealsLogger);

  useEffect(() => {
    //const intervalId1 = setInterval(logPast, 10000); //10 sec
    logPast();

    return () => {
      //clearInterval(intervalId1);
    };
  }, []);

  return (
    <div>
      <div className="">
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
        <button className="green-button" onClick={follow}>
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
      </div>

      <div>
        <h1 className="cool-font-medium">Squeals di {channel.channel_name}</h1>
        <br></br>
        <Container className="">
          <Row className="w-100">
            {squealsLogger.map((squeal) => (
              <Col lg={12} key={squeal.id} className="mb-4">
                <Card style={{ height: "100%" }} className="squeal">
                  <Card.Header className="d-flex flex-row justify-content-evenly align-items-center">
                    {" "}
                    <div>
                      <b>{squeal.sender}</b>
                    </div>
                    <div> TIPO: {squeal.message_type}</div>

                    <div> ID: {squeal._id}</div>
                  </Card.Header>
                  <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                    <div>{squeal.content}</div>
                  </Card.Body>
                  <Card.Footer>
                    <div>
                      <Reactions squeal={squeal.id} />
                    </div>
                  </Card.Footer>
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
