import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { userGlobal, setUserGlobal } = useUserContext();

  const [usernameForm, setUsernameForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");
  const [reset, setReset] = useState("");
  const [usernameReset, setUsernameReset] = useState("");
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
  const notify_success = () =>
    toast.success("Operazione effettuata con successo. Autenticarsi", {
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

  const resetPassword = async (e) => {
    e.preventDefault();
    openReset();

    if (newPassword.trim() === "" || reset.trim() === "") {
      //notify2();
    } else {
      const uri = `${ReactConfig.base_url_requests}/user/${usernameReset}/resetPassword`;
      const data = {
        password: newPassword,
        reset: reset,
      };
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
            notify_success();
          } else {
            notify();
            console.error("Reset failed", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Network error", error);
        });
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

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  //*reminder: input tag in React <input/>
  return (
    <div className="container">
      <div className="col-12 text-center pt-5 animated-title-container">
        <div className="row  ">
          <div className="col-12 d-flex flex-col justify-content-center align-items-center">
            <h1 className="animated-title cool-font">Log in to</h1>
            <h1 className="animated-squeal cool-font" aria-label="Squealer">
              &#129413;
            </h1>
          </div>
        </div>
      </div>

      <div className="row justify-content-center animated-top">
        <div className="col-6">
          <form onSubmit={handleLogin}>
            <div className="form-group row p-2 mb-0">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-medium"
              >
                Username
              </label>
              <input
                type="text"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputUsername"
                aria-describedby="username"
                autoComplete="on"
                value={usernameForm}
                onChange={(e) => setUsernameForm(e.target.value)}
                ref={input1Ref}
                onKeyDown={(e) => handleKeyPress(e, input2Ref)}
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="inputPassword"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                aria-describedby="password"
                autoComplete="on"
                value={passwordForm}
                ref={input2Ref}
                onChange={(e) => setPasswordForm(e.target.value)}
              />
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 mb-3 green-button box cool-font-text box"
                type="submit"
                onKeyDown={handleKeyFinal}
              >
                <ToastContainer />
                LOGIN
              </button>
              <button
                className="red-button box cool-font-text mb-3 box"
                onClick={resetPassword}
              >
                Password <br/> dimenticata?
              </button>
            </div>
          </form>

          {showReset && (
            <Modal show={showReset} onHide={closeReset} centered>
              <Modal.Header closeButton className="modal-delete-header">
                <h1 className="cool-font-text">Recupero Password</h1>
              </Modal.Header>
              <Modal.Body className="modal-delete-body p-4 d-flex flex-row justify-content-center align-items-center">
                <form onSubmit={resetPassword}>
                  <label className="form-label cool-font-text">Username</label>
                  <input
                    type="text"
                    style={{
                      width: "80%",
                      color: "#072f38",
                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={usernameReset}
                    onChange={(e) => setUsernameReset(e.target.value)}
                  />
                  <label className="form-label cool-font-text">
                    Qual è il tuo hobby preferito?
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "80%",
                      color: "#072f38",
                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={reset}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="inputPassword5"
                    className="form-label cool-font-text"
                  >
                    Nuova password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control cool-font-link text-center"
                    id="inputPassword"
                    style={{
                      fontColor: "#b45656",
                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={newPassword}
                    aria-describedby="passwordHelpBlock"
                    placeholder="Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    className="blue-button box mt-3 cool-font-small col-6"
                  >
                    ACCEDI
                  </button>
                </form>
              </Modal.Body>

              <Modal.Footer
                style={footerStyle}
                className="d-flex justify-content-center"
              >
                <button
                  className="red-button box cool-font-small col-6"
                  onClick={closeReset}
                >
                  ANNULLA
                </button>
              </Modal.Footer>
            </Modal>
          )}
          <div className="row p-2 mb-5">
            <button className="col-12 mb-3 yellow-button">
              <NavLink
                className="cool-font-text"
                to={ReactConfig.pathFunction("/registration")}
              >
                REGISTRATI
              </NavLink>
            </button>

            <button className="col-12 mb-5 yellow-button">
              <NavLink
                className="cool-font-text"
                to={ReactConfig.pathFunction("/home")}
              >
              SALTA IL LOGIN
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
