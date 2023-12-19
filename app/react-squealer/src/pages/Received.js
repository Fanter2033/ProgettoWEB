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
  let [currentUser, setCurrentUser] = useState({});

  const navigate = useNavigate();

  async function whoAmI() {
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          navigate("../");
        }
      })
      .then((data) => {
        setCurrentUser(data);
        setUserGlobal(data);
      })
      .catch((error) => {
        console.error(error);
      });
    //}
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

  useEffect(() => {
    whoAmI();
    getDashboard();
    const intervalId1 = setInterval(getDashboard, 5000); //10 sec

    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="container-flex my-blu">
        <div className="row">
          <div className="col-12 col-md-8">
            <h1 className="cool-font mt-2">CANALI SEGUITI</h1>

            <Container className="pb-5">
              <Row className=" ">
                {dash
                  .map((squeal) => (
                    <Col
                      lg={12}
                      key={squeal._id}
                      className="mb-4 d-flex justify-content-center align-items-center"
                    >
                      <Card style={{ width: "80%" }} className="squeal">
                        <Card.Header className="w-100">
                          <div className="col-12 d-flex flex-row justify-content-center align-items-center">
                            <div>
                              <span className="cool-medium">DA:</span>
                              <Link to="/infou" state={squeal.sender}>
                                <button
                                  className=" ms-2 custom-button box "
                                  aria-label="clicca se vuoi avere più informazioni su questo utente"
                                >
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
                          </div>
                          <div className="col-12 d-flex flex-row justify-content-center align-items-center mt-2">
                            <div className="cool-medium">PER:</div>
                            <ShowDest arrayDest={squeal.destinations} />
                          </div>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                          <SquealContent
                            content={squeal.content}
                            type={squeal.message_type}
                            id={squeal._id}
                          />
                        </Card.Body>
                        <Card.Footer className="">
                          <div className="row cool-medium d-flex">
                            <div className="col-12">
                              <button className="blue-button-status p-1 me-1">
                                👁️ {squeal.critical_mass / 0.25}
                              </button>
                              <button className="green-button-status p-1 ">
                                👍🏻 {squeal.positive_value}
                              </button>
                              <button className="red-button-status p-1 ms-1">
                                👎🏻 {squeal.negative_value}
                              </button>
                            </div>
                          </div>
                          <div className="col-12 cool-medium d-flex justify-content-center align-items-start mt-2">
                            <TypeSqueal typeSqueal={squeal.message_type} />
                          </div>
                          <div>
                            <Reactions
                              squeal={squeal._id}
                              reaction={squeal.reaction}
                            />
                          </div>
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

/*






*/
