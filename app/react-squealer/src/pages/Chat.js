import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import "../css/App.css";
import { Button, Card, Col, Row } from "react-bootstrap";


//TODO: GET utils/chat/ all private post----------------------------------------------------------------

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
        let camp = json.squeals;
        setSqueals(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  console.log("CHAAAAAAAAAT", squeals);

  useEffect(() => {
    const intervalId1 = setInterval(chatReq, 5000);

    return () => {
      clearInterval(intervalId1);
    };
  });

  return (
    <>
      <div className="cool-font-small">Chat component</div>

      <div className="container-flex pb-5">
        <div className="row">
          <div className="col-12">
            <h2>Privati:</h2>
            <Row className="ms-4 me-4">
              {squeals !== undefined ? (squeals.map((squeal) => (
                <Col key={squeal.id} lg={6} className="mb-4 ">
                  <Card>
                    <Card.Body className="mb-4 d-flex flex-row">
                      <Card.Title className="ms-4 me-4">
                        {squeal}
                      </Card.Title>
                      <Link to="/infou">
                        <Button variant="primary" className="ms-4 me-4">
                          Info
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))) : (
                <p>No private squeals</p>
              )
              }
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
