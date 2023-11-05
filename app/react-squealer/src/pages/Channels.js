import React from "react";
//import { useLocation } from "react-router-dom";

import Post from "./Post";
import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

/* 
TODO: let the chat disapper when on sm screen
*/
function Channels() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username');
  //const email = searchParams.get('email');
  
  //const username = match.params.username;
  console.log(username);
  //console.log(email);
  

  //const location = useLocation();
  //console.log(location.state);

  return (
    <div>
      <Navbar />
      <div className="container-flex">
        <div className="row">
          <div className="col-md-9">
            <h1>{username}</h1>
            <h1>CHANNELS</h1>
            <div>
              <Search />
              <Post />
            </div>
            <div className="row justify-content-center">
              <h3>TODO:</h3>
              <ul className="list-group col-md-4">
                <li className="list-group-item list">pubblici</li>
                <li className="list-group-item list">privati</li>
                <li className="list-group-item list">hash</li>
                <li className="list-group-item list">silenziabili</li>
                <li className="list-group-item list">popolarità</li>
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <h1>CHAT</h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Channels;
