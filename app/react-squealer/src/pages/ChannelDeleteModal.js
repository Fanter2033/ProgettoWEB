import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal } from "react-bootstrap";
import "../css/App.css";

const ChannelDeleteModal = () => {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //DELETE /channel/{type}/{channel_name}
  const handleDeleteChannel = () => {
    const uri = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
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
          console.log("Cancellazione canale riuscita con successo");
          navigate("/channels");
        } else {
          console.error("Delete failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
    handleClose();
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <button className="cool-font-link red-button box w-100" onClick={handleShow}>
        CANCELLA CHANNEL
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="modal-delete-header cool-font-medium"
          style={{ color: "#e0bb76" }}
        >
          <Modal.Title>CONFERMA ELIMINAZIONE</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="modal-delete-body cool-font-text p-5"
          style={{ color: "#072f38" }}
        >
          SEI SICURO DI VOLER ELIMINARE QUESTO CANALE?
          <br></br>
          QUESTA AZIONE È <span className="cool-font-link">IRREVERSIBILE</span>
        </Modal.Body>
        <Modal.Footer style={footerStyle}>
          <button
            className="red-button box cool-font-medium w-100"
            onClick={handleDeleteChannel}
          >
            ELIMINA CANALE
          </button>
          <button
            className="blue-button box cool-font-medium w-100"
            onClick={handleClose}
          >
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChannelDeleteModal;
