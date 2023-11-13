import React from "react";
//import ReactConfig from "../config/ReactConfig";
//import { useEffect } from "react";
//import { useState } from "react";

//import Post from "./Post";
import Search from "./Search";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { useLocation } from "react-router-dom";

/* 
TODO: let the chat disapper when on sm screen
*/

function Channels() {
  const location = useLocation();
  const { username } = location.state;

  console.log(username);

  /*
  <div onLoad={getChannels}>
</div>
  ------------
  const [users, setUsers] = useState([]);


  async function getChannels() {
  
    let result = fetch(`${ReactConfig.base_url_requests}/channels`);
    let response = await result;
    if(response.ok){
      let json = await response.json();
      setUsers(json.users);
      return json.users;
    }
  }

  useEffect(() => {
  }, []);
*/

  //TODO: POST /channel
  //TODO: GET /channel
  //TODO: GET /channels/{type}

  return (
    <div>
      <Navbar username={username} />
      <div className="container-flex">
        <div className="row">
          <div className="col-md-9">
            <h1>{username}</h1>
            <h1>CHANNELS</h1>
            <div>
              <Search />
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
