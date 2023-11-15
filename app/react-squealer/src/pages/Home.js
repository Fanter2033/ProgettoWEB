import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

//import Search from "./Search";
//import Post from "./Post";
import Footer from "./Footer";

import { Button, Card, Col, Row } from "react-bootstrap";

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

    return () => {
      clearInterval(intervalId1);
    };
  });

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

      <div className="container-flex pb-5">
        <div className="row">
          <div className="col-12">
            <h2>Lista TUTTI i Canali:</h2>
            <Row className="ms-4 me-4">
              {channels.map((channel) => (
                <Col key={channel.id} lg={6} className="mb-4 ">
                  <Card>
                    <Card.Body className="mb-4 d-flex flex-row">
                      <Card.Title className="ms-4 me-4">
                        {channel.channel_name}
                      </Card.Title>

                      <Link to="/infoc">
                        <Button variant="primary" className="ms-4 me-4">
                          Info
                        </Button>
                      </Link>

                      <Button variant="primary">Segui</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <h1>CHANNELS</h1>
            <div className=""></div>
            <div className="row justify-content-center">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4 pb-5">
                <li className="list-group-item list">GET CHANNELS</li>
                <li className="list-group-item list">GET HASH</li>
                <li className="list-group-item list">SEARCH</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
