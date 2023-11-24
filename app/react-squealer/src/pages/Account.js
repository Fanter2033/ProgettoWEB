import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUserContext } from "../config/UserContext";

import Geo from "./Geo";
import VultureAnimation from "./VoltureAnimation";

import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword.js";

import UserDeleteModal from "./UserDeleteModal";
import BuyQuoteModal from "./BuyQuoteModal";

import VipModal from "./VipModal";
import DowngradeModal from "./DowngradeModal.js";

import ConnectSMM from "./ConnectSMM";
import ToggleSMM from "./ToggleSMM";

import { Button, Card, Col, Row } from "react-bootstrap";

import "../css/App.css";
import cattyy from "./media/splash.jpeg";
import pink from "./media/avvoltoioEli.png";

/*
col-12 col-md-6
su schermi md e più grandi ho due colonne
tutti gli altri (quelli sm e xs) ho 1 col
*/

/*
obj destructoring, estraggo campi specifici da un obj
const { firstname, lastname, username, email, password } = userData;
*/

//TODO: GET /user/{username}/roles/
//TODO:NUM SQUEAL
function Account() {
  const { userGlobal, setUserGlobal } = useUserContext();
  console.log(userGlobal.vip, "viiiiip");

  //per il logout
  const navigate = useNavigate();

  const navigate_logout = useNavigate();
  if (userGlobal.username === undefined || userGlobal.username === "") {
    navigate_logout("/");
  }

  //VIP modalssssssss
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Downgrade modalssssssssss
  const [downgrade, setDowngrade] = useState(false);
  const openDowngrade = () => {
    setDowngrade(true);
  };
  const closeDowngrade = () => {
    setDowngrade(false);
  };

  //DELETE modalssssssss
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  //BUY modalssssssss
  const [buyModal, setBuyModal] = useState(false);
  const openBuyModal = () => {
    setBuyModal(true);
  };
  const closeBuyModal = () => {
    setBuyModal(false);
  };

  //SMM connect modalssssssssss
  const [connectSMM, setConnectSMM] = useState(false);
  const openConnect = () => {
    setConnectSMM(true);
  };
  const closeConnect = () => {
    setConnectSMM(false);
  };

  //toggle SMM
  const [isCliccato, setIsCliccato] = useState(true);
  const handleCliccatoChange = (val) => {
    setIsCliccato(val);
    //console.log(isCliccato, "cccccccccccccccccclick")
  };
  //following button
  const [following, setFollowing] = useState(false);
  const [created, setCreated] = useState(false);

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
    const intervalId = setInterval(getUserQuote, 10000); //10 sec
    getUserQuote();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
    getUserData();
    const intervalId = setInterval(getUserData, 10000); //10 sec
    const intervalId2 = setInterval(getSmm, 10000); //3 sec

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalId2);
    };
  }, []);

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

  //!channels
  const [channels, setChannels] = useState([]);

  //TODO: PUT: CANALI SEGUITI /user/${username}-----------------------------------------------------------------------------------------------------
  async function followedChannels() {
    setFollowing(true);
    //GET channels: if followed by user, print
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

  //TODO: GET: CANALI CREATI -----------------------------------------------------------------------------------------------------
  async function createdChannels() {
    setCreated(true);
    //GET channels: if user is owner, get
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

  //!vip

  /*
  user: string
  linked_smm: string
  linked_users: []
  */

  //TODO: GET /user/{username}/my-smm-----------------------------------------------------------------------------------------------------
  async function getSmm() {
    const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/my-smm`;
    await fetch(uri)
      .then((response) => {
        if (response.ok) {
          console.log(response);
        } else {
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

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
          <div className="col-12 col-md-6 d-flex flex-col align-items-center justify-content-center">
            <img
              src={cattyy}
              alt="Foto Profilo"
              className="rounded-circle ms-4 pfp box"
              onMouseOver={showVulture}
              onMouseLeave={hideVulture}
            />

          </div>
          {showVultureAnimation && <VultureAnimation />}

          <div className="col-12 col-md-6">
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
                    <button className="yellow-button box col-6">N SQUEALS</button>
                    {userGlobal.vip && (
                      <div
                        id="vip_buttons"
                        className="row d-flex flex-row justify-content-center align-items-center"
                      >
                        <ToggleSMM onCliccato={handleCliccatoChange} />

                        {isCliccato ? (
                          <button
                            className="col-6 upgrade-button mb-2 box"
                            onClick={openConnect}
                          >
                            MANAGE SMM
                          </button>
                        ) : null}
                        <ConnectSMM
                          openConnect={connectSMM}
                          closeConnect={closeConnect}
                        />

                        <button
                          className="col-6 upgrade-button mb-2 box"
                          onClick={openDowngrade}
                        >
                          DOWNGRADE
                        </button>
                      </div>
                    )}
                    <DowngradeModal
                      downgrade={downgrade}
                      closeDowngrade={closeDowngrade}
                    />
                    {!userGlobal.vip && (
                      <button
                        className="box upgrade-button"
                        onClick={handleShowModal}
                      >
                        UPGRADE
                      </button>
                    )}

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
              <h3 className="mb-4 cool-font-small">Quota rimanente</h3>
            </div>

            <div className="row d-flex align-items-center justify-content-evenly mb-4">
              <div className="col-12">
                <h4>Giornaliero</h4>
                <button className="yellow-button m-2 box">
                  {userQuote.remaining_daily}
                </button>
              </div>
              <div className="col-12">
                <h4>Settimanale</h4>
                <button className="yellow-button m-2 box">
                  {userQuote.remaining_weekly}
                </button>
              </div>
              <div className="col-12">
                <h4>Mensile</h4>
                <button className="yellow-button m-2 box">
                  {userQuote.remaining_monthly}
                </button>
              </div>
            </div>

            <button id="buy-button" className="box" onClick={openBuyModal}>
              BUY
            </button>
            <BuyQuoteModal buyModal={buyModal} closeBuyModal={closeBuyModal} />
            <p>per un anno????????</p>
            <p>MAX 10.000???</p>
          </div>

          <div className="col-md-6">
            <div className="col-12">
              <h3 className="cool-font-small">Limiti</h3>
              <h4>Giornaliero</h4>
              <button className="yellow-button m-2 box">
                {userQuote.limit_daily}
              </button>
            </div>
            <div className="col-12">
              <h4>Settimanale</h4>
              <button className="yellow-button m-2 box">
                {userQuote.limit_weekly}
              </button>
            </div>
            <div className="col-12">
              <h4>Mensile</h4>
              <button className="yellow-button m-2 box">
                {userQuote.limit_monthly}
              </button>
            </div>
            <h4 className="mt-4 mb-5 cool-font-small">
              Email: {userData.email}
            </h4>
          </div>
        </div>

        <div className=" mb-5">
          <div className=" d-flex flex-column justify-content-center align-items-center ">
            <button className="user_button mb-2 box" onClick={createdChannels}>
              CANALI CREATI
            </button>
            <button className="user_button mb-2 box" onClick={followedChannels}>
              CANALI SEGUITI
            </button>

            {!userGlobal.vip && <ChangeUsername />}
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
              onClick={handleOpenDeleteModal}
            >
              CANCELLA ACCOUNT
            </button>
            <UserDeleteModal
              showDeleteModal={showDeleteModal}
              handleCloseDeleteModal={handleCloseDeleteModal}
            />

            <button className="user_button mb-2 box">
              <Link to={ReactConfig.pathFunction("/about")} id="about-us">
                ABOUT US:
              </Link>
            </button>
          </div>
        </div>

        {following && (
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
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        )}

        {created && (
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
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
