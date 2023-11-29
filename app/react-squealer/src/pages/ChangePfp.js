import React, { useState, useEffect } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { useCallback } from "react";

import imageCompression from "browser-image-compression";

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
  console.log("mlmlmllmlmlmlml", userGlobal);

  const navigate = useNavigate();

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [base64Image, setBase64Image] = useState("");

  const handleImageUpload = useCallback(async (e) => {
    const imageFile = e.target.files[0];

    try {
      // compressione
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageFile, options);

      // conversione in Base64
      const compressedBase64 = await getBase64(compressedFile);
      setBase64Image(compressedBase64);
    } catch (error) {
      console.error("Errore durante la gestione dell'immagine:", error);
    }
  }, []);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  async function cambioPhoto(e) {
    e.preventDefault();

    //TODO: se il campo è vuoto apri toast, non funge

    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
      .then((res) => {
        console.log("aaaaaaaaaaaaaaaaaa", res);
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log("Tutto ok, io sono:", data);
        setUserGlobal(data);
      })
      .catch((error) => {
        console.error(error);
      });

    try {
      handleClose();
      const data = {
        user: {
          username: userGlobal.username,
          email: userGlobal.email,
          firstname: userGlobal.first_name,
          lastname: userGlobal.last_name,
          password: userGlobal.password,
          isAdmin: false,
          isSmm: false,
          isUser: true,
          pfp: base64Image,
        },
      };
      console.log("zzzzzzzzzzzzzzzzzzzzzz", userGlobal);
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
          console.log("Cambio pfp went good", data);
        })
        .catch((error) => {
          console.error("Cambio pfp failed, error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  //console.log("nomeeeeeeeeeeeeeeeeeeee", );

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
          <form>
            <label>Nuova foto</label>
            <input
              type="file"
              placeholder="inserisci qui"
              name="nuovaPfp"
              onChange={handleImageUpload}
            />
          </form>
          {base64Image && <img src={base64Image} alt="Selected" />}
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
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ChangePfp;
