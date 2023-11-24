import React, { useState, useEffect } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Chat from "./Chat";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Reactions from "./Reactions";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";
import penguin from "./media/penguin.jpeg";

//TODO: togli il NotFound
function Received() {
  const { userGlobal } = useUserContext();
  const navigate = useNavigate();

  if (userGlobal.username === undefined) {
    navigate("/");
  }

  //GET /dashboard/ ------------------------------------------------------------------------------------------------------------
  const [dash, setDash] = useState([]);

  //TODO: impedire che crashi
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

  console.log("DDDDDDDDDDDDDASH", dash);

  useEffect(() => {
    //getDashboard();
    const intervalId1 = setInterval(getDashboard, 10000); //10 sec
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  //TODO: ADD REACTIONS
  return (
    <>
      <Navbar />

      <div className="container-flex">
        <div className="row">
          <div className="col-12 col-md-8">
            <h1>Squeals CANALI seguiti</h1>
            <h2>- pubblici</h2>
            <h2>- privati</h2>

            {dash.length > 0 && (
              <Container className="">
                <Row className=" ">
                  {dash.map((squeal) => (
                    <Col lg={12} key={squeal.id} className="mb-4 d-flex justify-content-center align-items-center">
                      <Card style={{ width: "60%" }} className="squeal d-flex flex-col align-items-center">
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
                          <div>{squeal.content}</div>
                        </Card.Body>
                        <Card.Footer className="w-100">
                          <Reactions squeal={squeal._id}/>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            )}
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
                <img src={penguin} />
              </>
            )}
          </div>

          <div className="col-md-4 d-none d-md-block">
            <h1>CHAT</h1>
            <Chat />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Received;
