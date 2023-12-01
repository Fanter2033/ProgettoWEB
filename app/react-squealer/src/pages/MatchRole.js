import React from "react";
import { useState, useEffect } from "react";

import ReactConfig from "../config/ReactConfig";

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
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newValue, setNewValue] = useState(0);
  const [content, setContent] = useState("");

  const controllaPresenzaInArray = (stringa, array) => {
    return array.includes(stringa);
  };

  let ruoloIndex = -1;

  if (controllaPresenzaInArray(inputString, array1)) {
    ruoloIndex = 0;
    setContent("IN ATTESA");
  } else if (controllaPresenzaInArray(inputString, array2)) {
    ruoloIndex = 1;
    setContent("LETTORE");

  } else if (controllaPresenzaInArray(inputString, array3)) {
    ruoloIndex = 2;
    setContent("SCRITTORE");

  } else if (controllaPresenzaInArray(inputString, array4)) {
    ruoloIndex = 3;
    setContent("ADMIN");

  } else if (controllaPresenzaInArray(inputString, array5)) {
    ruoloIndex = 4;
    setContent("CREATORE");

  } else {
    return <p>NOT GOOD</p>;
  }

  const closeModal = () => {
    setModalIsOpen(false);
    setNewValue(0); // Resetta il valore della modalità di modifica
  };

  const handleModificaValore = () => {
    changeRoleSub();
    closeModal();
  };

  async function changeRoleSub() { 
    /*
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
          console.log("PATCH cambio ruolo OK");
        } else {
          console.error("PATCH cambio ruolo ERROR", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
      */
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <button
        className="custom-button box"
        onClick={() => setModalIsOpen(true)}
      >
        {newValue === 0
          ? "ATTESA"
          : newValue === 1
          ? "LETTORE"
          : newValue === 2
          ? "SCRITTORE"
          : newValue === 3
          ? "ADMIN"
          : newValue === 4
          ? "CREATORE"
          : "NOT GOOD"}
        {ruoloIndex}
        
      </button>
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title>Modifica Valore</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer
          className="my-foot d-flex justify-content-center"
          style={footerStyle}
        >
          <button className="blue-button box" onClick={handleModificaValore}>
            CAMBIA
          </button>
          <button variant="secondary" onClick={closeModal}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MatchRole;

/*
  const controllaPresenzaInArray = (stringa, array) => {
    return array.includes(stringa);
  };

  const trovaArrayEVisualizzaBottone = () => {
    if (controllaPresenzaInArray(inputString, array1)) {
      return <button>ATTESA</button>;
    } else if (controllaPresenzaInArray(inputString, array2)) {
      return <button>LETTORE</button>;
    } else if (controllaPresenzaInArray(inputString, array3)) {
      return <button>SCRITTORE</button>;
    } else if (controllaPresenzaInArray(inputString, array4)) {
      return <button>ADMIN</button>;
    } else if (controllaPresenzaInArray(inputString, array5)) {
      return <button>CREATORE</button>;
    } else {
      return <p>NOT GOOD</p>;
    }
  };
  */
