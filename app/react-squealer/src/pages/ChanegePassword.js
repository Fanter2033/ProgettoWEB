import React, { useState } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/App.css";

//PUT: CHANGE PSW /user/${username}-----------------------------------------------------------------------------------------------------
function ChangePassword() {
  const { userGlobal, setUserGlobal } = useUserContext();
  const [newPassword, setNewPassword] = useState();

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
    toast.error("⚠️ Manca la password!", {
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
    setUserGlobal({
      ...userGlobal,
      password: newPassword,
    });

    //console.log("mimmooooooooooooooooooooooooooooooooo" + userGlobal.password);

    if (newPassword.trim() === "") {
      //TODO: se il campo è vuoto apri toast, non funge
      nofity_error();
    } else {
      try {
        handleClose();
        const data = {
          user: {
            username: userGlobal.username,
            email: userGlobal.email,
            firstname: userGlobal.first_name,
            lastname: userGlobal.last_name,
            password: newPassword,
            isMod: false,
            isSmm: false,
            isUser: true,
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
              return res.json();
            }
          })
          .then((data) => {
            notify();
            console.log("Cambio password went good", data);
            navigate("/");
          })
          .catch((error) => {
            console.error("Cambio password failed, error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <button className="user_button mb-2 box" onClick={handleShow}>
        CAMBIO PASSWORD
      </button>

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
                placeholder="inserisci qui"
                name="nuovaPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            id="change-password"
            classname="custom-button"
            onClick={changeP}
          >
            CAMBIA
          </Button>
          <ToastContainer />
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
