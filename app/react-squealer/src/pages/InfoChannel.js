import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

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

  //TODO: GET /utils/squeals/{channel_type}/{channel_name}--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function logPast() {
    /*
    console.log("aaaaaaaaaaaaaaaa",channel.channel_name);
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

      if (result.ok) {
        let json = await result.json();
        setSquealsLogger(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    */
  }

  console.log("LOGGERRRRRRRRRRRRRR", squealsLogger);

  useEffect(() => {
    const intervalId1 = setInterval(logPast, 10000); //10 sec
    logPast();
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div>
      <div>
        <h3 className="cool-font-medium">
          Nome Canale: {channel.channel_name}
        </h3>
        <Link to="/details" state={channel}>
          <button className="yellow-button box">INFO</button>
        </Link>

        <button
          className="red-button box"
          onClick={() => window.history.back()}
        >
          &lt;-
        </button>
        <button className="green-button" onClick={follow}>
          SEGUI
        </button>
      </div>

      <div>
        <h1 className="cool-font">Squeals</h1>
        <br></br>
        <Container className="">
          <Row className="w-100">
            {squealsLogger.map((squeal) => (
              <Col lg={12} key={squeal.id} className="mb-4">
                <Card style={{ height: "100%" }} className="squeal">
                  <Card.Header className="d-flex flex-col justify-content-center align-items-center">
                    {" "}
                    <b>{squeal.sender}</b>
                  </Card.Header>
                  <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                    <div>{squeal.content}</div>
                  </Card.Body>
                  <Card.Footer>
                    <div>Id: {squeal._id}</div>

                    <div className="row"> </div>
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
