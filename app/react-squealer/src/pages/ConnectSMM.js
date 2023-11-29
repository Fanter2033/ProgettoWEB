import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState, useEffect } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";
//!vip
/*
user: string
linked_smm: string
linked_users: []
*/

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
  console.log(userData);
  useEffect(() => {
    getUserData();
    const intervalId = setInterval(getUserData, 30000); //30 sec

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //TODO: PATCH /user/{username}/pick-smm/{smm} ----------------------------------------------------------------------------------------------------------
  async function addSmm(e) {
    e.preventDefault();
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

  //TODO: PATCH /user/{username}/remove-smm -----------------------------------------------------------------------------------------------------
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

  //TODO: GET /user/{username}/my-smm-----------------------------------------------------------------------------------------------------
  async function getSmm() {
    const uri = `${ReactConfig.base_url_requests}/user/${userData.username}/my-smm`;
    await fetch(uri)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          //console.log("Got my smm succesfully");

        } else {
          console.error("Did not got my smm", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  return (
    <div>
      <Modal show={openConnect} onHide={closeConnect} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="">Manage SMM qui</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-6">
              <p>Connetti il tuo SMM</p>
              <input type="text" value={smm} onChange={handleInputChange} />

              <button className="green-button box mt-2 w-50" onClick={addSmm}>
                CONNETTI
              </button>
              <p >Ottieni info sul tuo SMM</p>
              <button className="green-button box mt-2 w-50" onClick={getSmm}>
                VAI
              </button>

              <p className="mt-4">Rimuovi SMM</p>
              <button className="red-button mb-2 box w-50" onClick={removeSmm}>
                RIMUOVI
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button className="upgrade-button" onClick={closeConnect}>
            Chiudi
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConnectSMM;
