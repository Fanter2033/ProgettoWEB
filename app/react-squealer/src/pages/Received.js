import React, { useState, useEffect } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Chat from "./Chat";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Reactions from "./Reactions";
import SquealContent from "./SquealContent";
import TypeSqueal from "./TypeSqueal";
import ShowDest from "./ShowDest";
import ShowComment from "./ShowComment";
import Comment from "./Comment";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

function Received() {
  const { userGlobal, setUserGlobal } = useUserContext();
  const navigate = useNavigate();

  if (userGlobal.username === undefined || userGlobal.username === "") {
    //GET WHO AM I--------------------------------------------------------------------------------
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Tutto ok, io sono:", data);
        const updated = {
          ...userGlobal,
          username: data.username,
        };
        setUserGlobal(updated);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //GET /dashboard/ ------------------------------------------------------------------------------------------------------------
  const [dash, setDash] = useState([]);

  async function getDashboard() {
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
      //console.log(result);

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
  }

  //console.log("DDDDDDDDDDDDDASH", dash);

  useEffect(() => {
    getDashboard();
    //getComments();
    const intervalId1 = setInterval(getDashboard, 10000); //10 sec
    //const intervalId2 = setInterval(getDashboard, 10000); //10 sec

    return () => {
      clearInterval(intervalId1);
      //clearInterval(intervalId2);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="container-flex">
        <div className="row d-flex justify-content-center">
          <h3 className="cool-font-small">TODO:</h3>
          <ul className="list-group col-md-4">
            <li className="list-group-item list">Stampa destinatari</li>
            <li className="list-group-item list">Commenti</li>
            <li className="list-group-item list mb-5">
              Reazioni per sempre???
            </li>
          </ul>
        </div>
        <div className="row">
          <div className="col-12 col-md-8">
            <h1 className="cool-font">CANALI SEGUITI</h1>

            <Container className="">
              <Row className=" ">
                {dash
                  .map((squeal) => (
                    <Col
                      lg={12}
                      key={squeal._id}
                      className="mb-4 d-flex justify-content-center align-items-center"
                    >
                      <Card
                        style={{ width: "80%" }}
                        className="squeal d-flex flex-col align-items-center"
                      >
                        <Card.Header className="w-100">
                          <div className="col-12 d-flex flex-row justify-content-between align-items-center">
                            <div>
                              <b>DA:</b>
                              <Link to="/infou" state={squeal.sender}>
                                <button className=" ms-2 custom-button box ">
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
                            </div>{" "}
                            <div className="cool-font-details">
                              👁️ {squeal.critical_mass / 0.25}
                            </div>
                          </div>
                          <div className="col-12 d-flex flex-row justify-content-start align-items-center">
                            <b>PER:</b>
                            <ShowDest arrayDest={squeal.destinations} />
                          </div>
                        </Card.Header>
                        <Card.Body className="mb-4 d-flex flex-col justify-content-center align-items-center">
                          <SquealContent
                            content={squeal.content}
                            type={squeal.message_type}
                          />
                        </Card.Body>
                        <Card.Footer className="w-100">
                          <div>
                            <Reactions squeal={squeal._id} />
                          </div>
                          <div className="cool-font-details">
                            Id: {squeal._id}
                          </div>
                          <TypeSqueal typeSqueal={squeal.message_type} />
                          <Comment squeal={squeal._id} />

                          <ShowComment arrayComment={squeal.comments} />
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                  .reverse()}
              </Row>
            </Container>

            {dash.length === 0 && (
              <>
                <div className="cool-font-small">
                  <h1 className="cool-font-medium">
                    NON sei iscritto a nessun canale
                  </h1>
                  <h2>Rimedia subito!</h2>
                  <h2>SEGUI</h2>
                  <h2 className="cool-font-medium">§CANALI UFFICIALI</h2>
                  <h2 className="cool-font-medium">§canali_utenti_pubblici</h2>
                  <h2 className="cool-font-medium">§canali_utenti_privati</h2>
                  <h2 className="cool-font-medium">#canali_estemporanei</h2>
                  <h3 className="cool-font-small">oppure</h3>
                  <h2>SCRIVI AI TUOI AMICI</h2>
                </div>
              </>
            )}
          </div>

          <div className="col-md-4 d-none d-md-block">
            <Chat />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Received;
