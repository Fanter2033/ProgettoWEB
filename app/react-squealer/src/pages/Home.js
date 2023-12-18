import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Footer from "./Footer";

import { Container, Card, Col } from "react-bootstrap";
import squeal_logo from "./media/icone/Nav_logo.png";
import "../css/App.css";

function Home() {
  //GET /channel    list of OFFICIAL channels ------------------------------------------------------------------------------------------------------------
  const [channels, setChannels] = useState([]);

  async function getChannels() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel/CHANNEL_OFFICIAL`;
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
        let camp = json.channels;
        setChannels(camp);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //console.log("LISTA CANALI", channels);

  useEffect(() => {
    const intervalId1 = setInterval(getChannels, 5000);
    getChannels();
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div className="pb-5 animated-title">
      <div className="col-12 p-4 d-flex flex-row justify-content-evenly align-items-center">
        <button className="me-1 green-button mb-1 box col-6 ">
          <NavLink
            className="me-1 cool-font-medium"
            to={ReactConfig.pathFunction("/registration")}
            style={{ textDecoration: "none" }}
          >
            REGISTRATI
          </NavLink>
        </button>
        <button className="ms-1 green-button mb-1 box col-6">
          <NavLink
            className="cool-font-medium"
            to={ReactConfig.pathFunction("./")}
            style={{ textDecoration: "none" }}
          >
            LOGIN
          </NavLink>
        </button>
      </div>

      <h2 className="cool-font-link">CANALI UFFICIALI</h2>
      <Container>
        {channels.map((channel) => (
          <Col lg={12} key={channel.channel_name}>
            <div>
              <Card style={{ height: "100%" }} className="squeal mb-4">
                <Card.Header className="d-flex justify-content-center align-items-center">
                  <Link to={ReactConfig.pathFunction("/infoc")} state={channel}>
                    <button
                      className="custom-button me-2 box cool-font-small"
                      aria-label="clicca se vuoi avere informazioni sul canale"
                    >
                      <b className="">{channel.channel_name} &nbsp;</b>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-info-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                    </button>
                  </Link>
                </Card.Header>
                <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="d-flex flex-row">
                    <img
                      src={squeal_logo}
                      alt="logo_squeal"
                      width="40"
                      height="40"
                    />
                    <div className="cool-font-text">&nbsp;CANALE UFFICIALE</div>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center cool-font-details">
                    <div>
                      SQUEAL: <b>{channel.posts}</b>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Container>

      <Footer />
    </div>
  );
}

export default Home;
