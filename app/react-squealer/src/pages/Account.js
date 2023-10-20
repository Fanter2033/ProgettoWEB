import React from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import cattyy from "./catty.jpg";
import "../App.css";
//col-12 col-md-6
//su schermi md e più grandi ho due colonne
//tutti gli altri (quelli sm e xs) ho 1 col

//dovrò passare l'utente

function Account() {
  return (
    <div>
      <div className="container-flex" id="elemento-espanso">
        <div className="row mb-5 mt-4">
          <div className="col-12 col-md-3">
            <img
              src={cattyy}
              alt="Foto Profilo"
              className="rounded-circle ms-5"
            />
          </div>

          <div className="col-12 col-md-9">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-evenly mb-4">
                <h1 className="cool-font-small">username</h1>
                <button className="custom-button">SEGUI</button>
              </div>

              <div className="row mb-4">
                <h2>Nome Cognome</h2>
              </div>

              <div className="row mb-4">
                <h3>Quota</h3>
                <div class="col-12 col-sm-4">
                  <button className="custom-button m-2">Daily</button>
                </div>

                <div class="col-12 col-sm-4">
                  <button className="custom-button m-2">Weekly</button>
                </div>

                <div class="col-12 col-sm-4">
                  <button className="custom-button m-2">Monthly</button>
                </div>

                <p>Email: nome.utente@example.com</p>
                <p>Località: Città, Paese</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-6 offset-3">
            <ul className="list-group">
              <li className="list-group-item list">Gestione Quota</li>
              <li className="list-group-item list">Numero Post</li>
              <li className="list-group-item list">Canali Seguiti</li>
              <li className="list-group-item list">Cambio Username</li>
              <li className="list-group-item list">Cambio Passord</li>
              <li className="list-group-item list">Reset Password</li>
              <li className="list-group-item list">Aggiungi SMM, SSE PRO</li>
              <li className="list-group-item list">Rimuovi SMM, SSE PRO</li>
              <li className="list-group-item list">Logout</li>
              <li className="list-group-item list mb-5">
                Delete Account CON TOAST
              </li>
              <li className="list-group-item list">
                <Link to={ReactConfig.pathFunction("/home/about")}>
                  About us:
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
