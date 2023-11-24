import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal, Row, Form } from "react-bootstrap";
import "../css/App.css";

//TODO: se canale gia esiste error
//TODO: se il campo è vuoto apri toast

//PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------
function ChangeNameChannel() {
  const location = useLocation();
  const channel = location.state;
  console.log(channel);

  const { userGlobal, setUserGlobal } = useUserContext();
  const [newUsername, setNewUsername] = useState();

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
    toast.error("⚠️ Manca il nome!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  //TODO: PUT channel/{type}/{channel_name} per cambiare nome
  const [newName, setNewName] = useState("");

  const handleChangeChannelName = (e) => {
    e.preventDefault();
    console.log("Cambiato il nome del canale:", channel.channel_name);

    if (newName.trim() === "") {
      nofity_error();
    } else {
      try {
        handleClose();
        const data = {
          channel: {
            name: newName,
            type: "CHANNEL_USERS",
            private: false,
          },
        };

        const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
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
            console.log(res);
            if (res.ok) {
              //creation ok
              return res.json();
            }
          })
          .then((data) => {
            notify();
            console.log("Cambio username went good", data);
            navigate("/");
          })
          .catch((error) => {
            console.error("Cambio username failed, error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  //console.log("nomeeeeeeeeeeeeeeeeeeee", channel.channel_name);

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <button className="blue-button mb-2 box" onClick={handleShow}>
        CAMBIO NOME CANALE
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title style={{ textAlign: "center" }}>
            Cambia nome canale
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Nuovo nome canale</Form.Label>
              <Form.Control
                type="text"
                placeholder="inserisci qui"
                name="nuovoUsername"
                value={newName}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={footerStyle}>
          <button className="blue-button box" onClick={handleChangeChannelName}>
            CAMBIA
          </button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNameChannel;
