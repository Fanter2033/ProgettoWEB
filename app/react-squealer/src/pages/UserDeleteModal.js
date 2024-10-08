import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

const UserDeleteModal = ({ showDeleteModal, handleCloseDeleteModal }) => {
  const { userGlobal, setUserGlobal } = useUserContext();
  const navigate = useNavigate();

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
          navigate(`./registration`);
        } else {
          console.error("Delete failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header
          closeButton
          className="modal-delete-header cool-font-medium"
          style={{ textAlign: "center", color: "#e0bb76" }}
        >
          <Modal.Title>CONFERMA ELIMINAZIONE</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="modal-delete-body cool-font-text"
          style={{ textAlign: "center", color: "#072f38" }}
        >
          Assicurati di <span className="cool-font-small">NON</span> essere il
          proprietario di una canale.
          <br></br>
          Sei sicuro di voler eliminare questo utente?
          <br></br>
          Questa azione è <span className="cool-font-link">IRREVERSIBILE</span>.
        </Modal.Body>
        <Modal.Footer style={footerStyle}>
          <button
            className="blue-button box cool-font-small w-100"
            onClick={deleteUser}
          >
            ELIMINA
          </button>
          <button
            className="red-button box cool-font-small w-100"
            onClick={handleCloseDeleteModal}
          >
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserDeleteModal;
