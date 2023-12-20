import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal, Row, Form } from "react-bootstrap";
import "../css/App.css";

//PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------
function ChangeNameChannel() {
  const location = useLocation();
  const channel = location.state;

  const { userGlobal, setUserGlobal } = useUserContext();

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const notify = () =>
    toast.success("🦄 Completato con successo!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const nofity_error = () =>
    toast.error("⚠️ Riempi tutti i campi!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notify_exist = () =>
    toast.error("⚠️ Questo nome è già in uso!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  //PUT channel/{type}/{channel_name} per cambiare nome
  const [newName, setNewName] = useState("");

  const handleChangeChannelName = (e) => {
    e.preventDefault();
    //console.log("Cambiato il nome del canale:", channel.channel_name);

    if (newName.trim() === "") {
      nofity_error();
    } else {
      try {
        const isItPrivate = channel.private;
        const data = {
          channel: {
            name: newName,
            type: "CHANNEL_USERS",
            private: isItPrivate,
          },
        };

        const url = `${ReactConfig.base_url_requests}/channel/${channel.type}/${channel.channel_name}`;
        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(data),
        };

        fetch(url, options)
          .then((res) => {
            if (!res.ok) {
              notify_exist();
            } else {
              notify();
              console.log("Cambio username went good");
              navigate("./");
              handleClose();
            }
          })
          .catch((error) => {
            console.error("Cambio nome canale failed, error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <button
        className="cool-font-link yellow-button mb-2 box w-100"
        onClick={handleShow}
      >
        CAMBIO NOME CANALE
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="modal-change-header cool-font-medium"
        >
          <Modal.Title style={{ textAlign: "center", color: "#e0bb76" }}>
            CAMBIA NOME CANALE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body p-5">
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label className="cool-font-medium">
                NUOVO NOME CANALE
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="inserisci qui"
                className="cool-font-small text-center"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                name="nuovoUsername"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={footerStyle}>
          <button
            className="blue-button box cool-font-medium w-100"
            onClick={handleChangeChannelName}
          >
            CAMBIA
          </button>
          <button
            className="red-button box cool-font-medium w-100"
            onClick={handleClose}
          >
            ANNULLA
          </button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNameChannel;
