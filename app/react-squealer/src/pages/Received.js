import React, { useState, useEffect } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Chat from "./Chat";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Reactions from "./Reactions";
import RenderMap from "./RenderMap";
import TextLink from "./TextLink";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import penguin from "./media/penguin.jpeg";

function Received() {
  const { userGlobal } = useUserContext();
  const navigate = useNavigate();

  if (userGlobal.username === undefined || userGlobal.username === "") {
    navigate("./");
  }

  //GET /dashboard/ ------------------------------------------------------------------------------------------------------------
  const [dash, setDash] = useState([]);

  async function getDashboard() {
    /*
    try {
      const uri = `${ReactConfig.base_url_requests}/utils/dashboard/`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      let result = await fetch(uri, options);
      console.log(result);

      if (result.ok) {
        let json = await result.json();
        console.log("MMMMMMMMMMMMMMMMMMMMMMMH", json);
        setDash(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    */
  }

  //console.log("DDDDDDDDDDDDDASH", dash);

  useEffect(() => {
    getDashboard();
    const intervalId1 = setInterval(getDashboard, 10000); //10 sec
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="container-flex">
        <div className="row">
          <div className="col-12 col-md-8">
            <h1>Squeals CANALI seguiti</h1>
            <h2>- pubblici</h2>
            <h2>- privati</h2>

            <Container className="">
              <Row className=" ">
                {dash.map((squeal) => (
                  <Col
                    lg={12}
                    key={squeal.id}
                    className="mb-4 d-flex justify-content-center align-items-center"
                  >
                    <Card
                      style={{ width: "60%" }}
                      className="squeal d-flex flex-col align-items-center"
                    >
                      <Card.Header className="w-100 d-flex flex-col justify-content-center align-items-center">
                        {" "}
                        <b>{squeal.sender}</b>
                        <Link to="/infou" state={squeal.sender}>
                          <button className="ms-4 me-4 custom-button box">
                            Info
                          </button>
                        </Link>
                        <div>Id: {squeal._id}</div>
                      </Card.Header>
                      <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                        {squeal.message_type === "MESSAGE_TEXT" && (
                          <>
                            <div>
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
                            <a href={squeal.content}>{squeal.content}</a>
                          </>
                        )}
                        {squeal.message_type === "POSITION" && (
                          <RenderMap coordinates={squeal.content} />
                        )}
                      </Card.Body>
                      <Card.Footer className="w-100">
                        <div>
                          <Reactions squeal={squeal._id} />
                        </div>
                        <div>Id: {squeal._id}</div>

                        {squeal.message_type === "MESSAGE_TEXT" && (
                          <>
                            {squeal.message_type}:
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-pencil"
                              viewBox="0 0 16 16"
                              alt="MESSAGE_TEXT"
                            >
                              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                          </>
                        )}
                        {squeal.message_type === "IMAGE" && (
                          <>
                            {squeal.message_type}:
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-card-image"
                              viewBox="0 0 16 16"
                              alt="IMAGE"
                            >
                              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                              <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                            </svg>
                          </>
                        )}
                        {squeal.message_type === "VIDEO_URL" && (
                          <>
                            {squeal.message_type}:
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
                          </>
                        )}
                        {squeal.message_type === "POSITION" && (
                          <>
                            {squeal.message_type}:
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-geo-alt"
                              viewBox="0 0 16 16"
                              alt="POSITION"
                            >
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                          </>
                        )}
                        {squeal.message_type === "TEXT_AUTO" && (
                          <>
                            {squeal.message_type}:
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-clock-history"
                              viewBox="0 0 16 16"
                              alt="TEXT_AUTO"
                            >
                              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                            </svg>
                          </>
                        )}
                        {squeal.message_type === "POSITION_AUTO" && (
                          <>
                            {squeal.message_type}:
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
                          </>
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>

            {dash.length === 0 && (
              <>
                <h1>NON sei iscritto a nessun canale</h1>
                <h2>Rimedia subito!</h2>
                <h2>SEGUI</h2>
                <h2>§CANALI UFFICIALI</h2>
                <h2>§canali_utenti_pubblici</h2>
                <h2>§canali_utenti_privati</h2>
                <h2>#canali_estemporanei</h2>
                <h3>oppure</h3>
                <h2>SCRIVI AI TUOI AMICI</h2>
              </>
            )}
          </div>

          <div className="col-md-4 d-none d-md-block">
            <h1>CHAT</h1>
            <Chat />
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-center ms-1 me-1 mb-5">
        <h3>TODO:</h3>
        <ul className="list-group col-md-4">
          <li className="list-group-item list">CM = VISUALIZZ * 0.25</li>
          <li className="list-group-item list">icona occhio</li>
          <li className="list-group-item list">crash dash</li>
          <li className="list-group-item list">
            PATCH squeal, per le reactions
          </li>
          <li className="list-group-item list">offset/</li>
          <li className="list-group-item list">GET img/</li>
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default Received;
