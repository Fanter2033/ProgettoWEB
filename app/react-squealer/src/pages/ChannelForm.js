import React, { useState } from "react";
import ReactConfig from "../config/ReactConfig";

import { Form, Modal } from "react-bootstrap";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/App.css";

function ChannelForm() {
  const [nameForm, setNameForm] = useState("");
  const [privateForm, setPrivateForm] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheckboxChange = () => {
    setPrivateForm(!privateForm);
  };

  const notify = () =>
    toast.error("Compila tutti i campi.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const createChannel = (e) => {
    e.preventDefault();

    //se i campi sono vuoti apri toast
    if (nameForm === "") {
      notify();
    } else {
      try {
        handleClose();
        const data = {
          channel: {
            name: nameForm,
            type: "CHANNEL_USERS",
            private: privateForm,
          },
        };

        //campo: private?
        const url = `${ReactConfig.base_url_requests}/channel`;
        const options = {
          method: "POST",
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
            console.log("Creazione canali went good", data);
          })
          .catch((error) => {
            console.error("Creazione canali failed, error:", error);
          });
      } catch (error) {
        //fail createChannels
        console.error(error);
      }
    }
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <button id="button-channel" className="box cool-font-small" onClick={handleShow}>
        NUOVO CANALE
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-buy-header">
          <Modal.Title className="text-center">Crea il tuo canale</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-buy-body">
          <Form>
            <Form.Group
              className="mb-4 d-flex flex-row "
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label className="ms-4 me-4">Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name of Channel :)"
                name="nome"
                value={nameForm}
                className="w-form-control"
                onChange={(e) => setNameForm(e.target.value)}
              />
            </Form.Group>

            <Form.Check
              inline
              type="checkbox"
              name="privato"
              label="Privato?"
              checked={privateForm}
              onChange={handleCheckboxChange}
              id="custom-checkbox"
              className="custom-control-input d-flex flex-row align-items-center"
            />
          </Form>
        </Modal.Body>

        <Modal.Footer
          style={footerStyle}
          className="my-foot d-flex justify-content-center"
        >
          <button className="green-button box" onClick={createChannel}>
            CREA
          </button>
          <button className="blue-button box" onClick={handleClose}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChannelForm;
