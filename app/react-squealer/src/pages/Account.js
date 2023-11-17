import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUserContext } from "../config/UserContext";

import Geo from "./Geo";
import VultureAnimation from "./VoltureAnimation";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChanegePassword";
import UserDeleteModal from "./UserDeleteModal";
import VipModal from "./VipModal";

import "../css/App.css";
import cattyy from "./media/splash.jpeg";
import pink from "./media/avvoltoioEli.png";
import { Modal, Button } from "react-bootstrap";

//TODO:modal for delete user

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
  //const location = useLocation();
  //const { username } = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  //per il logout
  const navigate = useNavigate();

  const navigate_logout = useNavigate();
  if (userGlobal.username === undefined || userGlobal.username === "") {
    navigate_logout("/");
  }

  //modalssssssss
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteUser = () => {
    handleCloseDeleteModal();
  };
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  //GET USER QUOTE-----------------------------------------------------------------------------------------------
  const [userQuote, setUserQuote] = useState("");

  async function getUserQuote() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/quote`;

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

  //GET USER DATA-----------------------------------------------------------------------------------------------
  const [userData, setUserData] = useState("");

  async function getUserData() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
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
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("logout riuscito con successo");
          navigate(`/`);
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
    const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
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

  //!channels
  //TODO: PUT: CANALI SEGUITI /user/${username}-----------------------------------------------------------------------------------------------------
  async function followedChannels() {
    //GET channels: if followed by user, print
  }

  //!quote
  //TODO: PATCH USER QUOTE /user/${username}/quote     when BUY is clicked percentageeeee-----------------------------------------------------------------------------------------------
  /*
  const simulatePaymentRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0;
        if (success) {
          resolve("Pagamento riuscito");
        } else {
          reject("Pagamento fallito");
        }
      }, 1000);
    });
  };
*/

  async function buyQuote() {
    /*
    simulatePaymentRequest()
      .then((response) => {
        alert("Pagamento effettuato con successo!");

        //TODO:body of squeal
        const data = {
          quote: {},
        };

        const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/quote`;
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
          .then((response) => {
            if (response.ok) {
              console.log("Aumento riuscito con successo");
            } else {
              console.error("Aumento fallito", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Network error", error);
          });

      })
      .catch((error) => {
        alert("Errore durante il pagamento. Riprova più tardi.");
      });

    <Modal show={showModal} onHide={handleShowModal}>
      <Modal.Header closeButton>
        <Modal.Title>Conferma Eliminazione Utente</Modal.Title>
      </Modal.Header>
      <Modal.Body>Sei sicuro di voler eliminare questo utente?</Modal.Body>
      <Modal.Footer>
        <button variant="secondary" onClick={handleCloseModal}>
          Annulla
        </button>
        <button variant="danger" onClick={simulatePaymentRequest}>
          Paga
        </button>
      </Modal.Footer>
    </Modal>;
    */
  }

  //!vip
  //TODO: PUT: ADD SMM /user/${username}----------------------------------------------------------------------------------------------------------
  async function addSmm() {}
  //TODO: PUT: REMOVE SMM /user/${username}-----------------------------------------------------------------------------------------------------
  async function removeSmm() {}

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
          <div className="col-12 col-md-4">
            <img
              src={cattyy}
              alt="Foto Profilo"
              className="rounded-circle ms-4"
              onMouseOver={showVulture}
              onMouseLeave={hideVulture}
            />

            {showVultureAnimation && <VultureAnimation />}
          </div>

          <div className="col-12 col-md-8">
            <div className="row">
              <div className="col-12 col-md d-flex align-items-center justify-content-center ">
                <div className="d-md-flex flex-md-row flex-column">
                  <div className="col-12">
                    <h1 className="d-flex flex-col align-items-center justify-content-center cool-font-medium mt-2 mb-2">
                      {userGlobal.username}
                      {userGlobal.vip && (
                        <img src={pink} style={{ width: "10%" }} />
                      )}
                    </h1>
                    <h2>
                      {userData.first_name} {userData.last_name}
                    </h2>
                    <button
                      className="user_button box"
                      style={{ width: "100%" }}
                    >
                      N SQUEALS
                    </button>
                    <button
                      className="box upgrade-button"
                      onClick={handleShowModal}
                    >
                      UPGRADE
                    </button>
                    <VipModal
                      showModal={showModal}
                      handleClose={handleCloseModal}
                    />
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
            <p>for a year</p>
            <p>MAX 10.000</p>
          </div>

          <div className="col-md-6">
            <h4 className="mt-4 mb-5">Email: {userData.email}</h4>
            <h4 className="mt-4">Dove sono nel mondo:</h4>
            <Geo />
          </div>
        </div>

        <div className=" mb-5">
          <div className=" d-flex flex-column justify-content-center align-items-center ">
            <button className="user_button mb-2 box" onClick={followedChannels}>
              CANALI CREATI
            </button>
            <button className="user_button mb-2 box" onClick={followedChannels}>
              CANALI SEGUITI
            </button>

            <ChangeUsername />
            <ChangePassword />

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
              className=" mb-2 box"
              onClick={showDeleteModal}
            >
              DELETE ACCOUNT
              <ToastContainer />
            </button>
            <UserDeleteModal
              showDeleteModal={showDeleteModal}
              handleDeleteUser={handleDeleteUser}
              handleCloseDeleteModal={handleCloseDeleteModal}
            />
            <button className="user_button mb-2 box">
              <Link to={ReactConfig.pathFunction("/about")} id="about-us">
                ABOUT US:
              </Link>
            </button>
          </div>
        </div>

        {userGlobal.vip && (
          <div
            id="vip_buttons"
            className="row d-flex flex-row justify-content-center align-items-center"
          >
            <button className="upgrade-button mb-2 box" onClick={addSmm}>
              ADD SMM?
            </button>
            <button className="upgrade-button mb-2 box" onClick={removeSmm}>
              NO MORE SMM!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
