import React, {useEffect, useState} from "react";
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

//PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------
function ChangeUsername() {
  const { userGlobal, setUserGlobal } = useUserContext();
  const [newUsername, setNewUsername] = useState();

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

    const notify_error_server = () =>
        toast.error("⚠️ Errore! Nome non valido o già in uso!", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

  const cambioU = (e) => {
    e.preventDefault();

    //TODO: se utente gia esiste error
    setUserGlobal({
      ...userGlobal,
      username: newUsername,
    });

    //console.log("mimmooooooooooooooooooooooooooooooooo" + userGlobal.username);

    if (newUsername.trim() === "") {
      //TODO: se il campo è vuoto apri toast, non funge
      nofity_error();
    } else {
      try {
        handleClose();
        const data = {
          user: {
            username: newUsername,
            email: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
            password: user.password,
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
              //creation ok
              return res.json();
            }
          })
          .then((data) => {
                notify();
                logoutUser();
                navigate("../");
          })
          .catch((error) => {
            console.error("Cambio username failed, error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

    async function logoutUser() {
        const uri = `${ReactConfig.base_url_requests}/auth/logout`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            mode: "cors",
        };

        fetch(uri, options)
            .then((response) => {
                if (response.ok) {
                    console.log("logout riuscito con successo");
                    navigate(`/`);
                } else {
                    notify();
                    console.error("Logout failed", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Network error", error);
            });
    }

  //console.log("nomeeeeeeeeeeeeeeeeeeee", userGlobal.username);

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <button className="user_button mb-2 box" onClick={handleShow}>
        CAMBIO USERNAME
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title style={{ textAlign: "center" }}>
            Cambia username
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Nuovo username</Form.Label>
              <Form.Control
                type="text"
                placeholder="inserisci qui"
                name="nuovoUsername"
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                }}
              />
              <Form.Label>Dopo l'operazione sarete deautenticati</Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={footerStyle}>
          <button className="blue-button box" onClick={cambioU}>
            CAMBIA
          </button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ChangeUsername;
