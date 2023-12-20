import React from "react";
import { useState } from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal } from "react-bootstrap";
import "../css/App.css";
import alert from "bootstrap/js/src/alert";

/*
  - [ ]  PATCH /channel/{type}/{name}/{username}
- nel body: {"new_role": intero}
  */

function ChangeRoleModal({
  closeRole,
  newRoleModel,
  username,
  channel,
  notify,
}) {
  const { userGlobal, setUserGlobal } = useUserContext();

  //!se iscritto
  const [selectedValue, setSelectedValue] = useState(null);

  const changeRoleSub = (e) => {
    e.preventDefault();

    const uri = `${ReactConfig.base_url_requests}/channel/${channel}/${username}`;
    const data = {
      new_role: selectedValue,
    };
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok === 401) {
          // noinspection JSValidateTypes
          alert("Errore. Non hai permessi per assegnare questo ruolo");
          console.error("PATCH cambio ruolo ERROR", response.statusText);
        } else {
          console.log("PATCH cambio ruolo OK");
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  };
  const handleButtonClick = (value) => {
    setSelectedValue(value);
  };
  
  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <div>
        <Modal show={newRoleModel} onHide={closeRole} centered>
          <Modal.Header closeButton className="modal-buy-header">
            <Modal.Title className="">CAMBIA RUOLO</Modal.Title>
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
            <button
              className="green-button box cool-font-medium w-100"
              onClick={changeRoleSub}
            >
              CAMBIA
            </button>
            <button
              className="blue-button box cool-font-medium w-100"
              onClick={closeRole}
            >
              ANNULLA
            </button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
}

export default ChangeRoleModal;
