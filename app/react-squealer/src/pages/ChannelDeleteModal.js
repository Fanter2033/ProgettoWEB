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
  console.log(channel);
  console.log("Canale da eliminare:", channel.channel_name);

  const { userGlobal, setUserGlobal } = useUserContext();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //TODO: DELETE /channel/{type}/{channel_name}
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
          console.log("Cancellazione riuscita con successo");
          navigate(`/channels`);
        } else {
          console.error("Delete failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <button className="red-button box" onClick={handleShow}>
        DELETE CHANNEL
      </button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-delete-header">
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-delete-body">
          Sei sicuro di voler eliminare questo cananle?
          <br></br>
          Questa azione è <span className="cool-font-small">IRREVERSIBILE</span>
        </Modal.Body>
        <Modal.Footer style={footerStyle}>
          <button className="red-button box" onClick={handleClose}>
            Annulla
          </button>
          <button className="blue-button box" onClick={handleDeleteChannel}>
            Elimina Canale
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChannelDeleteModal;
