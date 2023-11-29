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

//PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------
function ChangePfp() {
  const { userGlobal, setUserGlobal } = useUserContext();
  const [newPhoto, setNewPhoto] = useState();

  const navigate = useNavigate();

  const [show, setShow] = useState(true);
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
    toast.error("⚠️ Manca la foto!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const cambioPhoto = (e) => {
    e.preventDefault();

    if (newPhoto.trim() === "") {
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
            password: userGlobal.password,
            isMod: false,
            isSmm: false,
            isUser: true,
            pfp: newPhoto,
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
            console.log("Cambio pfp went good", data);
            navigate("./");
          })
          .catch((error) => {
            console.error("Cambio pfp failed, error:", error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageChange = (newImage) => {
    // Implement your logic to change the current image with the selected one
    console.log("Changing image to:", newImage);
    // Close the modal after changing the image
    //setIsModalOpen(false);
  };

  //console.log("nomeeeeeeeeeeeeeeeeeeee", userGlobal.username);

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title style={{ textAlign: "center" }}>Cambia foto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <Form>
            <Form.Group
              as={Row}
              className="mb-4"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Nuova foto</Form.Label>
              <Form.Control
                type="file"
                placeholder="inserisci qui"
                name="nuovaPfp"
                value={newPhoto}
                onChange={(e) => {
                  handleImageChange(e.target.files[0]);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer style={footerStyle}>
          <div>
            <button className="blue-button box" onClick={cambioPhoto}>
              CAMBIA
            </button>
            <button className="blue-button box" onClick={handleClose}>
              ANNULLA
            </button>
          </div>

          <ToastContainer />
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePfp;
