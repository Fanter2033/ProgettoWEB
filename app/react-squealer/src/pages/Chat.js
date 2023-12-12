import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import SquealContent from "./SquealContent";
import TypeSqueal from "./TypeSqueal";
import ShowComment from "./ShowComment";
import ShowDest from "./ShowDest";
import Comment from "./Comment";

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
        setSqueals(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  useEffect(() => {
    const intervalId1 = setInterval(chatReq, 10000);
    chatReq();
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <>
      <div className="container-flex pb-5">
        <div className="row ">
          <div className="col-12 justify-content-center align-items-center">
            <h1 className="cool-font-medium">CHAT</h1>
            <Container className="">
              <Row className="">
                {squeals.map((squeal) => (
                  <Col lg={12} className="mb-4" key={squeal._id}>
                    <Card style={{ width: "100%" }} className="squeal">
                      <Card.Header className="d-flex flex-column justify-content-center align-items-center">
                        <div>
                          <b className="cool-font-details"> DA: </b>
                          <Link to="/infou" state={squeal.sender}>
                            <button className=" ms-2 custom-button box">
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
                        <div className="row cool-font-details mt-2">
                          <div>ID: {squeal._id}</div>
                          <TypeSqueal typeSqueal={squeal.message_type} />
                        </div>
                      </Card.Header>
                      <Card.Body className="mb-4 d-flex flex-column justify-content-center align-items-center">
                        <SquealContent
                          content={squeal.content}
                          type={squeal.message_type}
                          id={squeal._id}
                        />
                      </Card.Body>
                      <Card.Footer>
                        <Comment squeal={squeal._id} />
                        <ShowComment arrayComment={squeal.comments} />
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
          {squeals.length === 0 && (
            <>
              <h1 className="cool-font-medium ">
                NON HAI NESSUNO SQUEAL PRIVATO
              </h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;

/*









                         <div>
 {squeal.content}
 </div>
*/
