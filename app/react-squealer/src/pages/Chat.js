import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import RenderMap from "./RenderMap";
import TextLink from "./TextLink";

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

  //console.log("CHAAAAAAAAAT", squeals);

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
        <div className="row ">
          <div className="col-12 justify-content-center align-items-center">
            <h1 className="cool-font-medium">CHAT</h1>
            <Container className="">
              <Row className="">
                {squeals.map((squeal) => (
                  <Col lg={12} className="mb-4">
                    <Card
                      style={{ width: "100%" }}
                      key={squeal._id}
                      className="squeal"
                    >
                      <Card.Header className="d-flex flex-col justify-content-center align-items-center">
                        {" "}
                        <Link to="/infou" state={squeal.sender}>
                          <button className="ms-4 me-4 custom-button box">
                            <b> {squeal.sender} </b>

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
                      <Card.Body
                        className="mb-4 d-flex flex-col justify-content-center align-items-center"
                        style={{ overflowWrap: "break-word" }}
                      >
                        {squeal.message_type === "MESSAGE_TEXT" && (
                          <>
                            <div className="cool-font-text">
                              <TextLink text={squeal.content} />
                            </div>
                          </>
                        )}
                        {squeal.message_type === "IMAGE" && (
                          <>
                            <img
                              src={`data:image/png;base64,${squeal.content}`}
                              alt="Image"
                            />
                          </>
                        )}
                        {squeal.message_type === "VIDEO_URL" && (
                          <>
                            <a
                              href={squeal.content}
                              className="cool-font-link youtube-link"
                            >
                              {squeal.content}
                            </a>
                          </>
                        )}
                        {squeal.message_type === "POSITION" && (
                          <RenderMap coordinates={squeal.content} />
                        )}
                        {squeal.message_type === "TEXT_AUTO" && (
                          <>
                            <div className="cool-font-text">
                              {squeal.content}
                            </div>
                          </>
                        )}
                        {squeal.message_type === "POSITION_AUTO" && (
                          <RenderMap coordinates={squeal.content} />
                        )}
                      </Card.Body>
                      <Card.Footer>
                        <div className="cool-font-details">
                          Id: {squeal._id}
                        </div>

                        {squeal.message_type === "MESSAGE_TEXT" && (
                          <>
                            <div className="cool-font-details">
                              <div>TESTO 📃</div>
                            </div>
                          </>
                        )}
                        {squeal.message_type === "IMAGE" && (
                          <>
                            <div className="cool-font-details">
                              <div>IMMAGINE 📷</div>
                            </div>
                          </>
                        )}
                        {squeal.message_type === "VIDEO_URL" && (
                          <>
                            <div className="cool-font-details d-flex justify-content-center">
                              <div>
                                VIDEO
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-youtube"
                                  viewBox="0 0 16 16"
                                  alt="VIDEO_URL"
                                >
                                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        )}
                        {squeal.message_type === "POSITION" && (
                          <>
                            <div className="cool-font-details">
                              <div>MAPPA 🗺️</div>
                            </div>
                          </>
                        )}
                        {squeal.message_type === "TEXT_AUTO" && (
                          <>
                            <div className="cool-font-details">
                              <div>TESTO A TEMPO 🕝</div>
                            </div>
                          </>
                        )}
                        {squeal.message_type === "POSITION_AUTO" && (
                          <>
                            <div className="cool-font-details d-flex justify-content-center">
                              <div>
                                MAPPA A TEMPO
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-geo-fill"
                                  viewBox="0 0 16 16"
                                  alt="POSITION_AUTO"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </>
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
          {squeals.length === 0 && (
            <>
              <h1>NON hai nessuno squeal privato per ora </h1>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
