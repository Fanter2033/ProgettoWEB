import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState, useEffect } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

function ConnectSMM({ openConnect, closeConnect }) {
  const { userGlobal } = useUserContext();

  const [smm, setSmm] = useState("");
  const handleInputChange = (event) => {
    setSmm(event.target.value);
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
    const intervalId = setInterval(getUserData, 30000); //30 sec

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //PATCH /user/{username}/pick-smm/{smm} ----------------------------------------------------------------------------------------------------------
  async function addSmm(e) {
    e.preventDefault();
    console.log("sono vip?", userData.vip);
    const uri = `${ReactConfig.base_url_requests}/user/${userData.username}/pick-smm/${smm}`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log("PATCH smm riuscita con successo");
        } else {
          console.error("Connection SMM failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  //PATCH /user/{username}/remove-smm -----------------------------------------------------------------------------------------------------
  async function removeSmm() {
    const uri2 = `${ReactConfig.base_url_requests}/user/${userData.username}/remove-smm`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri2, options)
      .then((response) => {
        if (response.ok) {
          console.log("smm removed successfully");
        } else {
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  //TODO non funzia
  //GET /user/{username}/my-smm-----------------------------------------------------------------------------------------------------
  const [mySmm, setMySmm] = useState("");
  async function getSmm() {
    const uri = `${ReactConfig.base_url_requests}/user/${userData.username}/my-smm`;

    await fetch(uri)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          let data = res.json;
          console.log(data);
          //setMySmm(data);
        } else {
          console.error("Errore nella richiesta:", res.statusText);
        }
        //console.log(mySmm);
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  return (
    <div>
      <Modal show={openConnect} onHide={closeConnect} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title
            className="cool-font-medium"
            style={{ color: "#e0bb76" }}
          >
            GESTISCI SMM QUI
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body cool-font-link">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-6">
              <p className="cool-font-details" style={{ color: "##528b57" }}>
                CONNETTI IL TUO SMM
              </p>
              <input
                className="form-control cool-font-details text-center box"
                type="text"
                value={smm}
                onChange={handleInputChange}
                style={{ color: "#e0bb76", backgroundColor: "#528b57" }}
              />

              <button
                className="green-button box mt-2 mb-4 w-100 cool-font-small "
                onClick={addSmm}
              >
                CONNETTI
              </button>
              <p style={{ color: "#072f38" }}>NOME DEL TUO SMM</p>
              <button
                className="blue-button box w-100 cool-font-small"
                onClick={getSmm}
              >
                VAI
              </button>

              <p style={{ color: "#b45656" }} className="mt-4">
                RIMUOVI SMM
              </p>
              <button
                className="red-button mb-2 box w-100 cool-font-small"
                onClick={removeSmm}
              >
                RIMUOVI
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button
            className="upgrade-button cool-font-small"
            onClick={closeConnect}
          >
            CHIUDI
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConnectSMM;
