import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

//import Search from "./Search";
import Footer from "./Footer";

import { Container, Card, Col, Row } from "react-bootstrap";
import "../css/App.css";

//TODO: vai su infoc senza auth?
//TODO: che squeal faccio vedere?

function Home() {
  //GET /channel    list of channels ------------------------------------------------------------------------------------------------------------
  const [channels, setChannels] = useState([]);

  async function getChannels() {
    try {
      const uri = `${ReactConfig.base_url_requests}/channel`;
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

  console.log("LISTA CANALI", channels);

  useEffect(() => {
    const intervalId1 = setInterval(getChannels, 5000);
    getChannels();
    return () => {
      clearInterval(intervalId1);
    };
  }, []);

  return (
    <div>
      <div className="col-12 pt-4 pb-4">
        <div className="mb-3">
          <NavLink
            style={{ color: "#072f38" }}
            className="cool-font-small"
            to={ReactConfig.pathFunction("/registration")}
          >
            Join the community
          </NavLink>
        </div>
        <div className="col-12 mb-2">
          <NavLink
            style={{ color: "#072f38" }}
            className="cool-font-small"
            to={ReactConfig.pathFunction("/")}
          >
            Login
          </NavLink>
        </div>
      </div>

      <h2>TUTTI i Canali:</h2>
      <Container fluide className="d-flex flex-column justify-content-center align-items-center p-5 mb-5">
        {channels.map((channel) => (
          <Col key={channel.id} lg={6} className="mb-4 ">
            <Card>
              <Card.Body className="mb-4  w-100 d-flex flex-column justify-content-center align-items-center">
                <Card.Title className="ms-4 me-4">
                  {channel.channel_name}
                </Card.Title>

                <Link to="/infoc" state={channel}>
                  <button className="custom-button ms-4 me-4">Info</button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Container>

      <Footer />
    </div>
  );
}

export default Home;
