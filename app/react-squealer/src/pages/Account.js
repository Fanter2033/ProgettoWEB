import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUserContext } from "../config/UserContext";

import Geo from "./Geo";
//import VultureAnimation from "./VoltureAnimation";

import ChangePfp from "./ChangePfp.js";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword.js";

import UserDeleteModal from "./UserDeleteModal";
import BuyQuoteModal from "./BuyQuoteModal";

import VipModal from "./VipModal";
import DowngradeModal from "./DowngradeModal.js";

import ConnectSMM from "./ConnectSMM";
import ToggleSMM from "./ToggleSMM";

import { Card, Col, Row } from "react-bootstrap";

import "../css/App.css";
import pink from "./media/avvoltoioEli.png";
import avvoltoio from "./media/avvoltoio.gif";

//TODO: check navigateeeeeeeeeeeeeee ho tolto il . davanti al /
//TODO: PFP
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
  const { userGlobal, setUserGlobal } = useUserContext();
  //console.log(userGlobal.vip, "viiiiip");

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
  const [show, setShow] = useState(true);

  const closeBuyModal = () => {
    setBuyModal(false);
  };

  const handleInternalButtonClick = () => {
    console.log("Bottone interno cliccato");
    closeBuyModal();
    //setShow(false);
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

  //ANIMATION----------------------------------------------------------------------------------------------------------------
  const [showVultureAnimation, setShowVultureAnimation] = useState(false);

  const showVulture = () => {
    setShowVultureAnimation(true);
  };

  const hideVulture = () => {
    setShowVultureAnimation(false);
  };

  //PFP----------------------------------------------------------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = () => {
    setIsModalOpen(!isModalOpen);
  };

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
        //console.log(data);
        setUserData(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  //console.log(userData);

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
        //console.log("GET quote:", quote);
        setUserQuote(quote);
        return quote;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //GET LOG SQUEALS VECCHI--------------------------------------------------------------
  const [squealsLogger, setSquealsLogger] = useState([]);

  async function log() {
    try {
      const url = `${ReactConfig.base_url_requests}/utils/squeals/${userGlobal.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      let result = await fetch(url, options);

      if (result.ok) {
        let json = await result.json();
        setSquealsLogger(json);
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //console.log("LOGGERRRRRRRRRRRRRR", squealsLogger);

  //GET /user/{username}/roles/
  const [roleUser, setRoleUser] = useState(0);

  async function getRoles() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/roles`;
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
        //console.log("Successo nella richiesta dei ruoli", data);
        setRoleUser(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }

  //console.log("RRRRRRRRRRRRROLE", roleUser);

  useEffect(() => {
    log();
    getUserData();
    getRoles();
    getUserQuote();
    //showVulture();

    const intervalId = setInterval(getUserData, 5000); //10 sec
    //const intervalId2 = setInterval(getSmm, 10000); //10 sec
    const intervalId3 = setInterval(getRoles, 10000); //10 sec
    const intervalId4 = setInterval(getUserQuote, 10000); //10 sec

    // per evitare memory leaks

    return () => {
      clearInterval(intervalId);
      //clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
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
  const [following, setFollowing] = useState(false);
  //OPEN CANALI SETTINGS -----------------------------------------------------------------------------------------------------
  const followedChannels = () => {
    setFollowing(!following);
  };

  //----------------------------------------------------------------------------------------------------------------
  return (
    <div className="container-flex">
      <div className="row" onLoad={getUserData}>
        <div className="row mb-5 mt-4">
          <div className="col-12 col-md-6 d-flex flex-col align-items-center justify-content-center">
            <img
              src={"data:image/png;base64," + userData.pfp}
              alt="Foto Profilo"
              className="rounded-circle ms-4 pfp box"
              onClick={() => handleImageClick()}
            />

            {isModalOpen && <ChangePfp />}

            {userData.isAdmin && (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#528b57"
                  className="bi bi-fingerprint"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.06 6.5a.5.5 0 0 1 .5.5v.776a11.5 11.5 0 0 1-.552 3.519l-1.331 4.14a.5.5 0 0 1-.952-.305l1.33-4.141a10.5 10.5 0 0 0 .504-3.213V7a.5.5 0 0 1 .5-.5Z" />
                  <path d="M6.06 7a2 2 0 1 1 4 0 .5.5 0 1 1-1 0 1 1 0 1 0-2 0v.332c0 .409-.022.816-.066 1.221A.5.5 0 0 1 6 8.447c.04-.37.06-.742.06-1.115zm3.509 1a.5.5 0 0 1 .487.513 11.5 11.5 0 0 1-.587 3.339l-1.266 3.8a.5.5 0 0 1-.949-.317l1.267-3.8a10.5 10.5 0 0 0 .535-3.048A.5.5 0 0 1 9.569 8Zm-3.356 2.115a.5.5 0 0 1 .33.626L5.24 14.939a.5.5 0 1 1-.955-.296l1.303-4.199a.5.5 0 0 1 .625-.329Z" />
                  <path d="M4.759 5.833A3.501 3.501 0 0 1 11.559 7a.5.5 0 0 1-1 0 2.5 2.5 0 0 0-4.857-.833.5.5 0 1 1-.943-.334Zm.3 1.67a.5.5 0 0 1 .449.546 10.72 10.72 0 0 1-.4 2.031l-1.222 4.072a.5.5 0 1 1-.958-.287L4.15 9.793a9.72 9.72 0 0 0 .363-1.842.5.5 0 0 1 .546-.449Zm6 .647a.5.5 0 0 1 .5.5c0 1.28-.213 2.552-.632 3.762l-1.09 3.145a.5.5 0 0 1-.944-.327l1.089-3.145c.382-1.105.578-2.266.578-3.435a.5.5 0 0 1 .5-.5Z" />
                  <path d="M3.902 4.222a4.996 4.996 0 0 1 5.202-2.113.5.5 0 0 1-.208.979 3.996 3.996 0 0 0-4.163 1.69.5.5 0 0 1-.831-.556Zm6.72-.955a.5.5 0 0 1 .705-.052A4.99 4.99 0 0 1 13.059 7v1.5a.5.5 0 1 1-1 0V7a3.99 3.99 0 0 0-1.386-3.028.5.5 0 0 1-.051-.705ZM3.68 5.842a.5.5 0 0 1 .422.568c-.029.192-.044.39-.044.59 0 .71-.1 1.417-.298 2.1l-1.14 3.923a.5.5 0 1 1-.96-.279L2.8 8.821A6.531 6.531 0 0 0 3.058 7c0-.25.019-.496.054-.736a.5.5 0 0 1 .568-.422Zm8.882 3.66a.5.5 0 0 1 .456.54c-.084 1-.298 1.986-.64 2.934l-.744 2.068a.5.5 0 0 1-.941-.338l.745-2.07a10.51 10.51 0 0 0 .584-2.678.5.5 0 0 1 .54-.456Z" />
                  <path d="M4.81 1.37A6.5 6.5 0 0 1 14.56 7a.5.5 0 1 1-1 0 5.5 5.5 0 0 0-8.25-4.765.5.5 0 0 1-.5-.865Zm-.89 1.257a.5.5 0 0 1 .04.706A5.478 5.478 0 0 0 2.56 7a.5.5 0 0 1-1 0c0-1.664.626-3.184 1.655-4.333a.5.5 0 0 1 .706-.04ZM1.915 8.02a.5.5 0 0 1 .346.616l-.779 2.767a.5.5 0 1 1-.962-.27l.778-2.767a.5.5 0 0 1 .617-.346Zm12.15.481a.5.5 0 0 1 .49.51c-.03 1.499-.161 3.025-.727 4.533l-.07.187a.5.5 0 0 1-.936-.351l.07-.187c.506-1.35.634-2.74.663-4.202a.5.5 0 0 1 .51-.49" />
                </svg>
              </>
            )}
          </div>

          <div className={`image-container`}>
            <img src={avvoltoio} alt="Avvoltoio animato" />
          </div>

          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-12 col-md d-flex align-items-center justify-content-center ">
                <div className="d-md-flex flex-md-row flex-column">
                  <div className="col-12">
                    <h1 className="d-flex flex-col align-items-center justify-content-center cool-font-medium mt-2 mb-2">
                      {userData.username}
                      {userData.vip && (
                        <img src={pink} style={{ width: "10%" }} />
                      )}
                    </h1>
                    {userData.locked && (
                      <>
                        <p className="altro">BLOCCATO</p>
                      </>
                    )}
                    <h2>
                      {userData.first_name} {userData.last_name}
                    </h2>
                    <button className="yellow-button box col-12 ">
                      N SQUEALS PUBBLICI: {squealsLogger.length}
                    </button>
                    {userData.vip && (
                      <div
                        id="vip_buttons"
                        className="row d-flex flex-row justify-content-center align-items-center"
                      >
                        <ToggleSMM mongoData={userData.isSmm} />

                        {!userData.isSmm ? (
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
                    {!userData.vip && (
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

            {show && (
              <button
                id="buy-button"
                className="box"
                onClick={() => setBuyModal(true)}
              >
                COMPRA
              </button>
            )}

            {buyModal && (
              <BuyQuoteModal
                onInternalButtonClick={handleInternalButtonClick}
                closeBuyModal={closeBuyModal}
              />
            )}
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
            <button className="user_button mb-2 box" onClick={followedChannels}>
              SITUAZIONE CANALI
            </button>
            {following && (
              <div className="container-flex pb-5">
                <div className="row">
                  <div className="col-12">
                    <Row className="ms-4 me-4">
                      {roleUser.map((channel) => (
                        <Col
                          key={channel.id}
                          lg={12}
                          className="mb-4 d-flex justify-content-center align-items-center"
                        >
                          {channel.role === 0 && (
                            <>
                              <Card className="w-50 offers">
                                <Card.Header className="m-2 d-flex flex-row justify-content-evenly">
                                  <Link to="/infoc" state={channel}>
                                    <button className="ms-4 me-4 custom-button box">
                                      <b>{channel.channel_name} </b>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                      </svg>
                                    </button>
                                  </Link>
                                </Card.Header>
                                <Card.Body className=" d-flex flex-row justify-content-evenly">
                                  <Card.Title className="ms-4 me-4 cool-font-text">
                                    RUOLO: IN ATTESA 🕓
                                  </Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <p className="cool-font-text">
                                    Tipo: {channel.type}
                                  </p>
                                </Card.Footer>
                              </Card>
                            </>
                          )}
                          {channel.role === 1 && (
                            <>
                              <Card className="w-50 offers">
                                <Card.Header className="m-2 d-flex flex-row justify-content-evenly">
                                  <Link to="/infoc" state={channel}>
                                    <button className="ms-4 me-4 custom-button box">
                                      <b>{channel.channel_name} </b>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                      </svg>
                                    </button>
                                  </Link>
                                </Card.Header>
                                <Card.Body className=" d-flex flex-row justify-content-evenly">
                                  <Card.Title className="ms-4 me-4 cool-font-text">
                                    RUOLO: LETTORE 📖
                                  </Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <p className="cool-font-text">
                                    Tipo: {channel.type}
                                  </p>
                                </Card.Footer>
                              </Card>
                            </>
                          )}
                          {channel.role === 2 && (
                            <>
                              <Card className="w-50 offers">
                                <Card.Header className="m-2 d-flex flex-row justify-content-evenly">
                                  <Link to="/infoc" state={channel}>
                                    <button className="ms-4 me-4 custom-button box">
                                      <b>{channel.channel_name} </b>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                      </svg>
                                    </button>
                                  </Link>
                                </Card.Header>
                                <Card.Body className=" d-flex flex-row justify-content-evenly">
                                  <Card.Title className="ms-4 me-4 cool-font-text">
                                    RUOLO: SCRITTORE ✒️
                                  </Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <p className="cool-font-text">
                                    Tipo: {channel.type}
                                  </p>
                                </Card.Footer>
                              </Card>
                            </>
                          )}
                          {channel.role === 3 && (
                            <>
                              <Card className="w-50 offers">
                                <Card.Header className="m-2 d-flex flex-row justify-content-evenly">
                                  <Link to="/infoc" state={channel}>
                                    <button className="ms-4 me-4 custom-button box">
                                      <b>{channel.channel_name} </b>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                      </svg>
                                    </button>
                                  </Link>
                                </Card.Header>
                                <Card.Body className=" d-flex flex-row justify-content-evenly">
                                  <Card.Title className="ms-4 me-4 cool-font-text">
                                    RUOLO: ADMIN ⚔️
                                  </Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <p className="cool-font-text">
                                    Tipo: {channel.type}
                                  </p>
                                </Card.Footer>
                              </Card>
                            </>
                          )}
                          {channel.role === 4 && (
                            <>
                              <Card className="w-50 offers">
                                <Card.Header className="m-2 d-flex flex-row justify-content-evenly">
                                  <Link to="/infoc" state={channel}>
                                    <button className="ms-4 me-4 custom-button box">
                                      <b>{channel.channel_name} </b>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-info-circle-fill"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                      </svg>
                                    </button>
                                  </Link>
                                </Card.Header>
                                <Card.Body className=" d-flex flex-row justify-content-evenly">
                                  <Card.Title className="ms-4 me-4 cool-font-text">
                                    RUOLO: CREATORE 👑
                                  </Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <p className="cool-font-text">
                                    Tipo: {channel.type}
                                  </p>
                                </Card.Footer>
                              </Card>
                            </>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
            )}

            {!userData.vip && <ChangeUsername />}
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
      </div>
      <div className="row d-flex justify-content-center ms-1 me-1 mb-5">
        <h3>TODO:</h3>
        <ul className="list-group col-md-4">
          <li className="list-group-item list">
            if owner of ch toast for DELETE
          </li>
          <li className="list-group-item list">
            FAI RICOMPARIRE IL BOTTONE COMPRA TRA 1 ANNO
          </li>
          <li className="list-group-item list">
            QUANDO RICLICCI SUL BOTTONE SITUA CANALI: si toglie la lista
          </li>
          <li className="list-group-item list">vedi se pubblici</li>
        </ul>
      </div>
    </div>
  );
}

export default Account;
