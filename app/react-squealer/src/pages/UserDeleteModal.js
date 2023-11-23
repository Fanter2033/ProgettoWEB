import React from "react";
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
          navigate(`/registration`);
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
    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
      <Modal.Header closeButton className="modal-delete-header">
        <Modal.Title>Conferma Eliminazione</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-delete-body">
        Sei sicuro di voler eliminare questo utente?
        <br></br>
        Questa azione è <span className="cool-font-small">IRREVERSIBILE</span>
      </Modal.Body>
      <Modal.Footer style={footerStyle}>
        <button className="red-button box" onClick={handleCloseDeleteModal}>
          Annulla
        </button>
        <button className="blue-button box" onClick={deleteUser}>
          Elimina Utente
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
