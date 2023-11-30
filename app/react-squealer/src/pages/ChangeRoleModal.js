import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

/*
  - [ ]  PATCH /channel/{type}/{name}/{username}
- nel body: {"new_role": intero}
  */

function ChangeRoleModal({ closeRole, newRoleModel, username, channel }) {
  console.log(username, channel);

  const { userGlobal, setUserGlobal } = useUserContext();

  //!se iscritto
  const [selectedValue, setSelectedValue] = useState(null);

  async function changeRoleSub() {
    const uri = `${ReactConfig.base_url_requests}/channel/${channel}/${username}`;
    const data = {
      new_role: selectedValue,
    };
    console.log("valore", selectedValue);
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
  }
  const handleButtonClick = (value) => {
    setSelectedValue(value);
    console.log(selectedValue);
  };
  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <div>
        <Modal show={newRoleModel} onHide={closeRole} centered>
          <Modal.Header closeButton className="modal-buy-header">
            <Modal.Title className="">Cambia Ruolo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-buy-body">
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                key={value}
                className="blue-button box"
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </button>
            ))}
          </Modal.Body>
          <Modal.Footer
            className="my-foot d-flex justify-content-center"
            style={footerStyle}
          >
            <button className="blue-button box" onClick={closeRole}>
              Annulla
            </button>
            <button className="green-button box" onClick={changeRoleSub}>
              CAMBIA
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ChangeRoleModal;
