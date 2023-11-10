import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/LoginForm.css";

//TODO: PUT: RESET PSW /user/${username}-----------------------------------------------------------------------------------------------------
//async function resetPassword() {}

function LoginForm() {
  const navigate = useNavigate();
  const { userGlobal, setUserGlobal } = useUserContext();

  const [usernameForm, setUsernameForm] = useState("");
  const [passwordForm, setPasswordForm] = useState("");

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

  
  const handleLogin = (e) => {
    e.preventDefault();

    
    setUserGlobal({
      ...userGlobal,
      username: usernameForm,
      password: passwordForm,
    });

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

    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + data);

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          navigate(`/channels`);
        } else {
          notify();
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  };

  //reminder: input tag in React <input/>
  return (
    <div className="container">
      <div className="row justify-content-center">
        <h1 className="text-center mb-5 mt-5 cool-font-medium">
          Log in to &#129413;
        </h1>

        <div className="col-6 ">
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
                onChange={(e) => setPasswordForm(e.target.value)}
              />
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-5 custom-button"
                type="submit"
              >
                <ToastContainer />
                LOGIN
              </button>
            </div>
          </form>

          <div className="row p-2 mb-5">
            <div className="col-12 mb-5">
              <NavLink
                style={{ color: "#072f38" }}
                className="cool-font-small"
                to={ReactConfig.pathFunction("/registration")}
              >
                New Here ?
              </NavLink>
            </div>

            <div className="col-12 mb-5">
              <NavLink
                style={{ color: "#072f38" }}
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

// Funzione generica per aggiornare le proprietà
/*
  const updateProperty = (propertyName, newValue) => {
    setUserGlobal({
      ...userGlobal,
      [propertyName]: newValue,
    });
  };


   */
//onClick={() => updateProperty('text', 'New text value')}
