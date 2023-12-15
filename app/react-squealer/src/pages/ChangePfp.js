import React, { useEffect, useState } from "react";
import { useUserContext } from "../config/UserContext";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import { useCallback } from "react";

import imageCompression from "browser-image-compression";

import Modal from "react-bootstrap/Modal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/App.css";

//PUT: CHANGE USERNAME /user/${username}-----------------------------------------------------------------------------------------------------
function ChangePfp() {
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
    toast.error("Immagine troppo grande", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const { userGlobal, setUserGlobal } = useUserContext();

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
    changePhoto();
  }

  function changePhoto() {
    try {
      handleClose();
      const data = {
        user: {
          username: user.username,
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          password: user.password,
          isMod: false,
          isSmm: false,
          isUser: true,
          pfp: base64Image,
        },
      };
      const url = `${ReactConfig.base_url_requests}/user/${user.username}`;
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
          notify();
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
        <Modal.Header
          closeButton
          className="modal-change-header cool-font-medium"
        >
          <Modal.Title style={{ textAlign: "center", color: "#e0bb76" }}>
            CAMBIA FOTO
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body">
          <form className="cool-font-medium">
            <label>INSERISCI NUOVA FOTO</label>
            <input
              type="file"
              id="nuovaPfp"
              name="nuovaPfp"
              style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control box cool-font-link mb-3"
            />
          </form>
          {base64Image && (
            <>
              <figure className="cool-font-link">
                <img
                  src={base64Image}
                  alt="Selected new profile photo"
                  aria-label="Questa è la foto che vorresti mettere come foto profilo"
                />
                <figcaption>Foto profilo che hai scelto</figcaption>
              </figure>
            </>
          )}
          <div className="cool-font-link mt-2">
            NB: È CONSIGLIATO L'USO DI FOTO QUADRATE
          </div>
        </Modal.Body>

        <Modal.Footer style={footerStyle}>
          <button
            className="blue-button box cool-font-medium w-100"
            onClick={cambioPhoto}
          >
            CAMBIA
          </button>
          <button
            className="red-button box cool-font-medium w-100"
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

export default ChangePfp;
