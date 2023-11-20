import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import "../css/App.css";
import { Container, Card, Col, Row } from "react-bootstrap";

//GET utils/chat/ all private post----------------------------------------------------------------

function Chat() {
  const [squeals, setSqueals] = useState([]);

  async function chatReq() {
    try {
      const url = `${ReactConfig.base_url_requests}/utils/chat/`;
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
        /*
        for (let s of json) {
          squeals.push(s);
        }
        */
        setSqueals(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("CHAAAAAAAAAT", squeals);

  useEffect(() => {
    const intervalId1 = setInterval(chatReq, 10000); //10 sec
    chatReq();
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <>
      <div className="container-flex pb-5">
        <div className="row">
          <div className="col-12">
            <h2>Squeals Privati:</h2>

            <Container className="">
              <Row className="w-100">
                {squeals.map((squeal) => (
                  <Col lg={12} key={squeal.id} className="mb-4">
                    <Card style={{ height: "100%" }}>
                      <Card.Header className="d-flex flex-col justify-content-center align-items-center">
                        {" "}
                        <b>{squeal.sender}</b>
                        <Link to="/infou">
                          <button className="ms-4 me-4 custom-button box">
                            Info
                          </button>
                        </Link>
                      </Card.Header>
                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                        <div>{squeal.content}</div>
                      </Card.Body>
                      <Card.Footer>
                        <div>Id: {squeal._id}</div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
