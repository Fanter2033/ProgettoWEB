import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/LoginForm.css";

//TODO: PUT: RESET PSW /user/${username}-----------------------------------------------------------------------------------------------------

function LoginForm() {
  const navigate = useNavigate();
  const { userGlobal, setUserGlobal } = useUserContext();

  const [usernameForm, setUsernameForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");
  const [reset, setReset] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const notify = () =>
    toast.error("Errore di autenticazione. Riprovare", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const login = async () => {
    //corrected with love by @romanellas
    //URI: where I want ot send the POST
    //according to Swagger specifics, the username is sent in path, with the requested role.

    const data = { password: userGlobal.password };
    const uri = `${ReactConfig.base_url_requests}/auth/${userGlobal.username}/0`;
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          navigate(`./received`);
        } else {
          notify();
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  };

  //*reset password: domanda utente
  const [showReset, setShowReset] = useState(false);
  const openReset = () => {
    setShowReset(true);
  };
  const closeReset = () => {
    setShowReset(false);
  };

  const handleInputChange = (event) => {
    setReset(event.target.value);
  };

  const notify2 = () =>
    toast.error("Errore. Compila tutti i campi.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const resetPassword = async () => {
    openReset();

    if (newPassword.trim() === "" || reset.trim() === "") {
      //notify2();
    } else {
      /*
    const data = { reset: reset };
    const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/resetPassword`;
    const data = {
      user: {
        username: username,
        password: password,
        reset: reset,
      },
    }
    const options = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          navigate(`./received`);
          console.error("Reset successful", response.statusText);
        } else {
          notify();
          console.error("Reset failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
    */
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let tmp = userGlobal;
    tmp.username = usernameForm;
    tmp.password = passwordForm;

    setUserGlobal(tmp);

    await login();
  };

  //*MUOVITI CON I TASTI
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const handleKeyPress = (event, nextInputRef) => {
    if (event.key === "Enter") {
      event.preventDefault();
      nextInputRef.current.focus();
    }
  };
  const handleKeyFinal = (event) => {
    if (event.key === "Enter") {
      console.log("Tasto Invio premuto!");
    }
  };

  //*reminder: input tag in React <input/>
  return (
    <div className="container">
      <div className="col-12 text-center pt-5 animated-title-container">
        <div className="row  ">
          <div className="col-12 d-flex flex-col justify-content-center align-items-center">
            <h1 className=" animated-title cool-font-medium">Log in to</h1>
            <h1 className="animated-squeal cool-font" aria-label="Squealer">
              &#129413;
            </h1>
          </div>
        </div>
      </div>

      <div className="row justify-content-center ">
        <div className="col-6">
          <form onSubmit={handleLogin}>
            <div className="form-group row p-2 mb-3">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-small"
              >
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                aria-describedby="username"
                placeholder="username"
                autoComplete="on"
                value={usernameForm}
                onChange={(e) => setUsernameForm(e.target.value)}
                ref={input1Ref}
                onKeyDown={(e) => handleKeyPress(e, input2Ref)}
              />
            </div>

            <div className="form-group row p-2 mb-4">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-small"
              >
                Password
              </label>
              <input
                type="password"
                id="inputPassword"
                className="form-control"
                aria-describedby="password"
                placeholder="password"
                autoComplete="on"
                value={passwordForm}
                ref={input2Ref}
                onChange={(e) => setPasswordForm(e.target.value)}
              />
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-3 yellow-button"
                type="submit"
                onKeyDown={handleKeyFinal}
              >
                <ToastContainer />
                LOGIN
              </button>
            </div>
          </form>
          <button className="yellow-button mb-4" onClick={resetPassword}>
            Forgor password?
          </button>

          {showReset && (
            <Modal show={showReset} onHide={closeReset} centered>
              <Modal.Header closeButton className="modal-delete-header">
                <Modal.Title>Recupero Password</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-delete-body">
                <form onSubmit={resetPassword}>
                  <label className="form-label cool-font-small">
                    Qual è il tuo hobby preferito?
                  </label>
                  <input
                    type="text"
                    value={reset}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="inputPassword5"
                    className="form-label cool-font-small"
                  >
                    Nuova password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="inputPassword"
                    value={newPassword}
                    aria-describedby="passwordHelpBlock"
                    placeholder="Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <button type="submit" className="blue-button box mt-5">
                    Accedi
                  </button>
                </form>

                <button className="red-button box" onClick={closeReset}>
                  Annulla
                </button>
              </Modal.Body>
            </Modal>
          )}
          <div className="row p-2 mb-5">
            <div className="col-12 mb-4">
              <NavLink
                style={{ color: "#e0bb76" }}
                className="cool-font-small"
                to={ReactConfig.pathFunction("/registration")}
              >
                New Here ?
              </NavLink>
            </div>

            <div className="col-12 mb-5">
              <NavLink
                style={{ color: "#e0bb76" }}
                className="cool-font-small"
                to={ReactConfig.pathFunction("/home")}
              >
                Skip the log in !
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
