import React, {useState, useRef, useEffect} from "react";
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
  const [currentUser, setCurrentUser] = useState({});

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

  async function whoAmI() {
    //if (userGlobal.username === undefined || userGlobal.username === "") {
    //GET WHO AM I--------------------------------------------------------------------------------
    const uri = `${ReactConfig.base_url_requests}/auth/whoami`;
    fetch(uri, {
      mode: "cors",
      credentials: "include",
    })
        .then((res) => {
          console.log('Hey ris', res);
          if (res.ok) {
            navigate(`./received`);
          }
        })
        .then((data) => {
          if(typeof data === 'undefined') return;
          setCurrentUser(data);
          setUserGlobal(data);
        })
        .catch((error) => {

        });
    //}
  }

  useEffect(() => {
    whoAmI();
  }, []);

  const login = async (t1) => {
    //corrected with love by @romanellas
    //URI: where I want ot send the POST
    //according to Swagger specifics, the username is sent in path, with the requested role.

    const data = { password: t1.password };
    const uri = `${ReactConfig.base_url_requests}/auth/${t1.username}/0`;
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

    if(typeof userGlobal !== 'undefined') {
      let tmp = userGlobal;
      tmp.username = usernameForm;
      tmp.password = passwordForm;
      setUserGlobal(tmp);
    }

    let t1 = {
      username: usernameForm,
      password: passwordForm
    }
    setCurrentUser(t1);

    await login(t1);
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
            <h1 className="animated-title cool-font">Accedi a </h1>
            <h1 className="animated-squeal cool-font" aria-label="Squealer">
              &#129413;
            </h1>
          </div>
        </div>
      </div>

      <div className="row justify-content-center animated-top">
        <div className="col-6">
          <form onSubmit={handleLogin}>
            <div className="form-group row  mb-0">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-medium"
              ></label>
              <input
                type="text"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputUsername"
                aria-describedby="username"
                autoComplete="on"
                placeholder="Username"
                value={usernameForm}
                onChange={(e) => setUsernameForm(e.target.value)}
                ref={input1Ref}
                onKeyDown={(e) => handleKeyPress(e, input2Ref)}
              />
            </div>

            <div className="form-group row  mb-3">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-medium"
              ></label>
              <input
                type="password"
                id="inputPassword"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                aria-describedby="password"
                autoComplete="on"
                placeholder="Password"
                value={passwordForm}
                ref={input2Ref}
                onChange={(e) => setPasswordForm(e.target.value)}
              />
            </div>

            <div className="form-group row ">
              <button
                className="col-12 mb-3 green-button box cool-font-text box"
                type="submit"
                onKeyDown={handleKeyFinal}
              >
                <ToastContainer />
                ACCEDI
              </button>
              <button
                className="red-button box cool-font-text mb-3 box"
                onClick={resetPassword}
              >
                PASSWORD <br /> DIMENTICATA?
              </button>
            </div>
          </form>

          {showReset && (
            <Modal show={showReset} onHide={closeReset} centered>
              <Modal.Header closeButton className="modal-delete-header">
                <h1 className="cool-font-medium">RECUPERO PASSWORD</h1>
              </Modal.Header>
              <form onSubmit={resetPassword}>
                <Modal.Body className="modal-delete-body p-4 d-flex flex-column justify-content-center align-items-center">
                  <label className="form-label cool-font-text">USERNAME</label>
                  <input
                    type="text"
                    style={{
                      width: "80%",
                      color: "#e0bb76",

                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={usernameReset}
                    onChange={(e) => setUsernameReset(e.target.value)}
                    className="cool-font-medium"
                  />
                  <label className="form-label cool-font-text mt-1">
                    QUAL È IL TUO PASSANTEMPO PREFERITO?
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "80%",
                      color: "#e0bb76",

                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={reset}
                    onChange={handleInputChange}
                    className="cool-font-medium"
                  />
                  <label
                    htmlFor="inputPassword5"
                    className="form-label cool-font-text mt-4"
                  >
                    NUOVA PASSWORD
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control cool-font-link text-center"
                    id="inputPassword"
                    style={{
                      width: "80%",
                      color: "#e0bb76",
                      backgroundColor: "#072f38",
                      borderRadius: "0.5rem",
                    }}
                    value={newPassword}
                    aria-describedby="passwordHelpBlock"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Modal.Body>

                <Modal.Footer
                  style={footerStyle}
                  className="d-flex justify-content-center"
                >
                  <button
                    type="submit"
                    className="blue-button box mt-3 cool-font-medium col-6"
                  >
                    ACCEDI
                  </button>
                  <button
                    className="red-button box cool-font-medium col-6"
                    onClick={closeReset}
                  >
                    ANNULLA
                  </button>
                </Modal.Footer>
              </form>
            </Modal>
          )}
          <div className="row  mb-5">
            <button className="col-12 mb-3 yellow-button box">
              <NavLink
                className="cool-font-text"
                to={ReactConfig.pathFunction("/registration")}
              >
                REGISTRATI
              </NavLink>
            </button>

            <button className="col-12 mb-5 yellow-button box">
              <NavLink
                className="cool-font-text "
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
