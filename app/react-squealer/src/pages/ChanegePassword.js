import React from "react";
import { useState } from "react";
import ReactConfig from "../config/ReactConfig";


import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import "../css/App.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/LoginForm.css";

//PUT: CHANGE PSW /user/${username}-----------------------------------------------------------------------------------------------------
function ChangePassword(props) {
  console.log(props);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newPassword, setNewPassword] = useState();

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

  const changeP = (e) => {
    e.preventDefault();

    //TODO: se il campo è vuoti apri toast

    try {
      handleClose();
      const data = {
        user: {
          email: props.userData.email,
          firstname: props.userData.first_name,
          lastname: props.userData.last_name,
          password: props.userData.password,
          password: newPassword,
          isMod: false,
          isSmm: false,
          isUser: true,
        },
      };

      const url = `${ReactConfig.base_url_requests}/user/${props.userData.username}`;
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
            //post ok
            return res.json();
          }
        })
        .then((data) => {
          notify();
          console.log("Cambio password went good", data);
        })
        .catch((error) => {
          console.error("Cambio password failed, error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button className="user_button mb-2 box" onClick={handleShow}>
        CAMBIO PASSWORD
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            Cambia password
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Nuova password</Form.Label>
              <Form.Control
                type="text"
                placeholder="new password"
                name="nuovaPassword"
                value={props.userData.password}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button id="change-password" classname="custom-button" onClick={changeP}>
            CAMBIA
          </Button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
