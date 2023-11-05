import React from "react";
//import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Navbar from "./Navbar";

import "../css/App.css";
import cattyy from "./media/catty.jpg";

//col-12 col-md-6
//su schermi md e più grandi ho due colonne
//tutti gli altri (quelli sm e xs) ho 1 col

//obj destructoring, estraggo ca,pi specifici da un obj
//const { firstname, lastname, username, email, password } = userData;
/*
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  profileImage: 'profile.jpg',
};

*/

//input
//{username: string}
/*
interface Props{
  username: string[];
}
*/

function Account() {
  /*
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${ReactConfig.base_url_requests}/user`)
      .then((res) => res.json())
      .then((result) => {
        setUsers(result);
      });
  }, []);

  const usersArray = Object.values(users);

  <div>
  {usersArray.map((user, index) => (
    <ol key={index}>Username: {user}</ol>
  ))}
</div>

<div>{userItems}</div>


  const userItems = [];

  for(let i=0; i< usersArray.length; i++){
    const user = usersArray[i];
    userItems.push(<li key={i}>email: {user.email}</li>)
  }
  /*
  ! add if you use the following code
  - props to Account 
  - {user ? <div>{user.email}</div> : <div>Loading...</div>} IN THE RETURN

  const [user, setUser] = useState("");
  const username = props.match.params.username;

  useEffect(() => {

    try {
      const url = `${ReactConfig.base_url_requests}/user/${username}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            console.error("Errore:", response.statusText);
          }
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => console.error("Errore", error));
    } 
    catch (error) {
      console.error("Errore:", error);
    }
  }, []);
  */

  /*
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // Funzione per effettuare una richiesta GET a un'API REST
    const fetchAPI = async () => {
      try {
        const quoteUrl = `${ReactConfig.base_url_requests}/user/${username}/quote`;
        const quoteOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        };

        const response = await fetch(quoteUrl, quoteOptions);

        if (!response.ok) {
          console.error("error", response.statusText);
        }

        const quote = await response.json();
        setQuote(quote);
      } 
      catch (error) {
        console.error("Errore:", error);
      }
    };

    // Richiama la funzione fetchAPI quando il componente è montato
    fetchAPI();
  }, []);

-------------------------
   <div>
   <h1>API Response:</h1>
   <pre>{JSON.stringify(quote, null, 2)}</pre>
   
 </div>

  */

  return (
    <div>
      <div className="container-flex" id="elemento-espanso">
        <Navbar />
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
                <div className="col-12 col-sm-4">
                  <button className="custom-button m-2">Daily</button>
                </div>

                <div className="col-12 col-sm-4">
                  <button className="custom-button m-2">Weekly</button>
                </div>

                <div className="col-12 col-sm-4">
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
