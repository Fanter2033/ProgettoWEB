import React from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";

import Chat from "./Chat";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../css/App.css";

function Received() {
  const { userGlobal } = useUserContext();
  const navigate = useNavigate();

  if (userGlobal.username === undefined) {
    navigate("/");
  }

  return (
    <>
      <Navbar />

      <div className="container-flex">
        <div className="row">
          <div className="col-12 col-md-8">
            <h1>Squeals ricevuti</h1>
            <h2>Canali seguiti</h2>
            <h2>Squeals Pubblici</h2>
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
