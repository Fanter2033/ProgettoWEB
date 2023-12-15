import React from "react";
import { useState, useEffect } from "react";

import ReactConfig from "../config/ReactConfig";
import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

import "../css/App.css";

function MatchRole({
  inputString,
  array1,
  array2,
  array3,
  array4,
  array5,
  name,
  type,
  onInputPresenceChange,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newValue, setNewValue] = useState(-1);
  const [content, setContent] = useState("");
  const { userGlobal, setUserGlobal } = useUserContext();

  const controllaPresenzaInArray = (stringa, array) => {
    return array.includes(stringa);
  };

  let ruoloIndex = -1;

  if (controllaPresenzaInArray(inputString, array1)) {
    ruoloIndex = 0;
  } else if (controllaPresenzaInArray(inputString, array2)) {
    ruoloIndex = 1;
  } else if (controllaPresenzaInArray(inputString, array3)) {
    ruoloIndex = 2;
  } else if (controllaPresenzaInArray(inputString, array4)) {
    ruoloIndex = 3;
  } else if (controllaPresenzaInArray(inputString, array5)) {
    ruoloIndex = 4;
  } else {
    ruoloIndex = -1;
  }
  onInputPresenceChange(ruoloIndex !== -1);

  const closeModal = () => {
    setModalIsOpen(false);
    setNewValue(0);
  };

  const handleModificaValore = () => {
    changeRoleSub();
    closeModal();
  };

  async function changeRoleSub() {
    const uri = `${ReactConfig.base_url_requests}/channel/${type}/${name}/${inputString}`;
    const data = {
      new_role: newValue,
    };

    console.log("valore", newValue);

    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          console.log("PATCH cambio ruolo OK", newValue);
        } else {
          console.error("PATCH cambio ruolo ERROR", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  function attesa() {
    setNewValue(0);
  }
  function lettore() {
    setNewValue(1);
  }
  function scrittore() {
    setNewValue(2);
  }
  function admin() {
    setNewValue(3);
  }
  function creatore() {
    setNewValue(4);
  }

  return (
    <div>
      {inputString !== userGlobal.username && (
        <>
          {ruoloIndex === 4 ? (
            <>
              <button className="custom-button box cool-font-medium">
                {<>{ruoloIndex === 4 && "CREATORE 👑"}</>}
              </button>
            </>
          ) : (
            <>
              <button
                className="custom-button box cool-font-medium"
                onClick={() => setModalIsOpen(true)}
              >
                {
                  <>
                    {ruoloIndex === 0
                      ? "ATTESA 🕓"
                      : ruoloIndex === 1
                      ? "LETTORE 📖"
                      : ruoloIndex === 2
                      ? "SCRITTORE ✒️"
                      : ruoloIndex === 3
                      ? "ADMIN ⚔️"
                      : "NOT GOOD"}
                  </>
                }
              </button>
            </>
          )}
        </>
      )}
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header
          closeButton
          className="modal-change-header cool-font-medium"
          style={{ color: "#e0bb76" }}
        >
          <Modal.Title>MODIFICA RUOLO</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <div className="d-flex flex-column justify-content-center align-items-center cool-font-medium">
            <button
              className="green-button box  w-100 m-2"
              onClick={() => attesa}
            >
              IN ATTESA 🕓
            </button>
            <button
              className="green-button box  w-100 m-2"
              onClick={() => lettore()}
            >
              LETTORE 📖
            </button>
            <button
              className="green-button box  w-100 m-2"
              onClick={() => scrittore()}
            >
              SCRITTORE ✒️
            </button>
            <button
              className="green-button box  w-100 m-2"
              onClick={() => admin()}
            >
              ADMIN ⚔️
            </button>
            <button
              className="green-button box  w-100 m-2"
              onClick={() => creatore()}
            >
              CREATORE 👑
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="my-foot d-flex justify-content-center"
          style={footerStyle}
        >
          <button
            className="blue-button box cool-font-medium w-100"
            onClick={handleModificaValore}
          >
            CAMBIA
          </button>
          <button
            className="red-button box cool-font-medium w-100"
            onClick={closeModal}
          >
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MatchRole;
