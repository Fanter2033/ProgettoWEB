import React, { useEffect, useState } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import Modal from "react-bootstrap/Modal";
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

    if (newPassword === "") {
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
      <button
        className="user_button mb-2 box cool-font-text"
        onClick={handleShow}
      >
        CAMBIO PASSWORD
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title
            style={{ textAlign: "center", color:"#e0bb76" }}
            className="cool-font-medium"

          >
            CAMBIA PASSWORD
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body cool-font-medium">
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label style= {{color:"#e0bb76"}}>NUOVA PASSWORD</Form.Label>
              <Form.Control
                type="text"
                placeholder="inserisci qui"
                className="text-center "
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                name="nuovaPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer
          style={footerStyle}
          className="d-flex justify-content-center"
        >
          <button
            className="blue-button cool-font-medium box col-6"
            onClick={changeP}
          >
            CAMBIA
          </button>
          <button
            className="red-button cool-font-medium box col-6"
            onClick={handleClose}
          >
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ChangePassword;
