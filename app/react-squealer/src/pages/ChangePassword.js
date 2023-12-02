import React, { useEffect, useState } from "react";
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

  const [user, setUser] = useState({});

  useEffect(() => {
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(async (data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  const notify_error_server = () =>
    toast.error("⚠️ Errore! Modifica password fallita", {
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

    setUserGlobal({
      ...user,
      password: newPassword,
    });

    if (newPassword.trim() === "") {
      nofity_error();
    } else {
      try {
        handleClose();
        const data = {
          user: {
            username: user.username,
            email: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
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
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => {
            if (data.status === 200) {
              notify();
            }
            navigate("./");
          })
          .catch((error) => {
            console.error("Cambio password failed, error:", error);
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
    <div>
      <button className="user_button mb-2 box" onClick={handleShow}>
        CAMBIO PASSWORD
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title style={{ textAlign: "center" }}>
            Cambia password
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-change-body">
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

        <Modal.Footer style={footerStyle}>
          <button className="blue-button box" onClick={changeP}>
            CAMBIA
          </button>
          <button className="red-button box" onClick={handleClose}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
