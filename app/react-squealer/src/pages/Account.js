import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/LoginForm.css";

import Geo from "./Geo";
import VultureAnimation from "./VoltureAnimation";

import "../css/App.css";
import cattyy from "./media/splash.jpeg";

/*
col-12 col-md-6
su schermi md e più grandi ho due colonne
tutti gli altri (quelli sm e xs) ho 1 col
*/

/*
obj destructoring, estraggo campi specifici da un obj
const { firstname, lastname, username, email, password } = userData;
*/

function Account() {
  //username from <Navbar/>
  const location = useLocation();
  const { username } = location.state;

  //per il logout
  const navigate = useNavigate();

  /*
  ---------------------------------------------------------
 fetch(`${ReactConfig.base_url_requests}/user`)
   .then((res) => res.json())
   .then((result) => {
     setUsers(result);
     usersArray = Object.values(users);
   });
------------------------------------------------------------
  const userItems = [];
  for (let i = 0; i < usersArray.length; i++) {
    const user = usersArray[i];
    userItems.push(<li key={i}>email: {user.email}</li>);
  }
  <div>{userItems}</div>
  ---------------------------------------------------------
*/

  /*-------------------------------------------------------------------getUsers + div
  const [users, setUsers] = useState([]);
  async function getUsers() {
    let result = fetch(`${ReactConfig.base_url_requests}/user`);
    let response = await result;
    if(response.ok){
      let json = await response.json();
      setUsers(json.users);
      return json.users;
    }
  }

  useEffect(() => {}, []);

   <div>
   {users.map((user, index) => (
     <ol key={index}>Email: {user.email}</ol>
   ))}
 </div>
*/
  //GET USER QUOTE-----------------------------------------------------------------------------------------------
  const [userQuote, setUserQuote] = useState("");

  async function getUserQuote() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${username}/quote`;

      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let quote = await result.json();
        console.log(quote);
        setUserQuote(quote);
        return quote;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(getUserQuote, 3000);
    return () => {
      clearInterval(intervalId);
    };
  });

  //TODO: PATCH USER QUOTE /user/${username}/quote-----------------------------------------------------------------------------------------------

  //GET USER DATA-----------------------------------------------------------------------------------------------
  const [userData, setUserData] = useState("");

  async function getUserData() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${username}`;
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let data = await result.json();
        console.log(data);
        setUserData(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(getUserData, 10000);
    return () => {
      clearInterval(intervalId);
    };
  });

  //LOGOUT  USER------------------------------------------------------------------------------
  const notify = () =>
    toast.error("Errore durante il logout. Riprovare", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  async function logoutUser() {
    const uri = `${ReactConfig.base_url_requests}/auth/logout`;
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("logout riuscito con successo");
          navigate(`/`, { state: { username } });
        } else {
          notify();
          console.error("Logout failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  //DELETE USER con toast /user/${username}-----------------------------------------------------------------------------------------------------
  async function deleteUser() {
    notify();
    const uri = `${ReactConfig.base_url_requests}/user/${username}`;
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("Cancellazione riuscita con successo");
          navigate(`/registration`);
        } else {
          console.error("Delete failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  //TODO: PUT: ADD SMM /user/${username}----------------------------------------------------------------------------------------------------------
  async function addSmm() {}

  //TODO: PUT: REMOVE SMM /user/${username}-----------------------------------------------------------------------------------------------------
  async function removeSmm() {}

  //TODO: PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------

  async function changeUsername() {
    /*
    const data = {
      user: {
        username: username,
        email: userData.email,
        firstname: userData.first_name,
        lastname: userData.last_name,
        password: userData.password,
        isMod: false,
        isSmm: false,
        isUser: true,
      },
    };

    const url = `${ReactConfig.base_url_requests}/user/${username}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //registration ok
          return res.json();
        }
      })
      .then((data) => {
        console.log("Registrazione went good", data);
      })
      .catch((error) => {
        console.error("Registration failed, error:", error);
      });
      */
  }

  //TODO: PUT: CHANGE PSW /user/${username}-----------------------------------------------------------------------------------------------------
  async function changePassword() {
    /*
  async function changeUsername() {
    const data = {
      user: {
        username: username,
        email: userData.email,
        firstname: userData.first_name,
        lastname: userData.last_name,
        password: userData.password,
        isMod: false,
        isSmm: false,
        isUser: true,
      },
    };

    const url = `${ReactConfig.base_url_requests}/user/${username}`;
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify(data),
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //registration ok
          return res.json();
        }
      })
      .then((data) => {
        console.log("Registrazione went good", data);
      })
      .catch((error) => {
        console.error("Registration failed, error:", error);
      });
  }
  */
  }

  //TODO: PUT: RESET PSW /user/${username}-----------------------------------------------------------------------------------------------------
  async function resetPassword() {}

  //TODO: PUT: CANALI SEGUITI /user/${username}-----------------------------------------------------------------------------------------------------
  async function followedChannels() {}

  //-----------------------------------------------------------------------------------------------------------------
  //TODO: PUT: BUY QUOTE /user/${username}-----------------------------------------------------------------------------------------------------
  async function buyQuote() {}

  //----------------------------------------------------------------------------------------------------------------
  const [showVultureAnimation, setShowVultureAnimation] = useState(false);

  const showVulture = () => {
    setShowVultureAnimation(true);
  };

  const hideVulture = () => {
    setShowVultureAnimation(false);
  };
  //----------------------------------------------------------------------------------------------------------------
  return (
    <div className="container-flex">
      <div className="row" onLoad={getUserData}>
        <div className="row mb-5 mt-4">
          <div className="col-12 col-md-3">
            <img
              src={cattyy}
              alt="Foto Profilo"
              className="rounded-circle"
              onMouseOver={showVulture}
              onMouseLeave={hideVulture}
            />
            {showVultureAnimation && <VultureAnimation />}
          </div>

          <div className="col-12 col-md-9">
            <div className="row">
              <div className="col-12 col-md d-flex align-items-center justify-content-center ">
                <div className="d-md-flex flex-md-row flex-column">
                  <div className="col-8">
                    <h1 className="cool-font-medium mt-2 mb-2">{username}</h1>
                    <h2>
                      {userData.first_name} {userData.last_name}
                    </h2>
                  </div>

                  <div className="col-4">
                    <button
                      className="user_button box"
                      style={{ width: "100%" }}
                    >
                      N SQUEALS
                    </button>
                    <button
                      id="upgrade-button"
                      className="box"
                      onClick={buyQuote}
                    >
                      UPGRADE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4 ">
          <div className="col-md-6">
            <div className="row">
              <h3 className="mb-4">Quota rimanente</h3>
            </div>

            <div className="row d-flex align-items-center justify-content-evenly">
              <div className="col-sm-6">
                <h4>Daily</h4>
                <button className="custom-button m-2 box">
                  {userQuote.remaining_daily}
                </button>
              </div>
              <div className="col-sm-6">
                <h4>Weekly</h4>
                <button className="custom-button m-2 box">
                  {userQuote.remaining_weekly}
                </button>
              </div>
              <div className="col-sm-6">
                <h4>Monthly</h4>
                <button className="custom-button m-2 box">
                  {userQuote.remaining_monthly}
                </button>
              </div>
            </div>

            <button id="buy-button" className="box" onClick={buyQuote}>
              BUY
            </button>
          </div>

          <div className="col-md-6">
            <h4 className="mt-4 mb-5">Email: {userData.email}</h4>
            <h4 className="mt-4">Dove sono nel mondo:</h4>
            <Geo />
          </div>
        </div>

        <div className="row mb-5">
          <div className=" d-flex flex-column justify-content-center align-items-center ">
            <button className="user_button mb-2 box" onClick={changePassword}>
              CAMBIO PASSWORD
            </button>
            <button className="user_button mb-2 box" onClick={resetPassword}>
              RESET PASSWORD??
            </button>
            <button className="user_button mb-2 box" onClick={followedChannels}>
              CANALI SEGUITI
            </button>

            <button
              id="logout-button"
              className=" mb-2 box"
              onClick={logoutUser}
            >
              <ToastContainer />
              LOGOUT
            </button>
            <button
              id="delete-button"
              className=" mb-2box"
              onClick={deleteUser}
            >
              DELETE ACCOUNT
              <ToastContainer />
            </button>
            <button className="user_button mb-2 box">
              <Link to={ReactConfig.pathFunction("/about")}>About us:</Link>
            </button>
          </div>
        </div>

        <div id="vip_buttons">
          <button className="user_button mb-2 box" onClick={addSmm}>
            ADD SMM?
          </button>
          <button className="user_button mb-2 box" onClick={removeSmm}>
            NO MORE SMM!
          </button>
          <button className="user_button mb-2 box" onClick={changeUsername}>
            CAMBIO USERNAME
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
