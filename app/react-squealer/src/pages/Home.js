import React from "react";
import { NavLink } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Search from "./Search";
import Post from "./Post";
import Footer from "./Footer";

//import { useLocation } from "react-router-dom";

//gli utenti non autenticati possono usare la serach?

function Home() {
  return (
    <div>
      <div className="col-12 mb-5 mt-5">
        <NavLink
          style={{ color: "#072f38" }}
          className="cool-font-small"
          to={ReactConfig.pathFunction("/registration")}
        >
          Join the community
        </NavLink>
      </div>

      <div className="container-flex mb-5">
        <div className="row">
          <div className="col-12">
            <h1>CHANNELS</h1>
            <div className="mb-5">
              <Search />
              <Post />
            </div>
            <div className="row justify-content-center">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4">
                <li className="list-group-item list">pubblici</li>
                <li className="list-group-item list">hash</li>
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
