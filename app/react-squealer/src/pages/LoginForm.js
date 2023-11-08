import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const handleLogin = () => {
    //corrected with love by @romanellas
    //URI: where I want ot send the POST
    //according to Swagger specifics, the username is sent in path, with the requested role.

    const data = { password: password };
    const uri = `${ReactConfig.base_url_requests}/auth/${username}/0`;
    const options = {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    };

    fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          //let user = response.json();
          //console.log(user);
          //navigate(`/channels?username=${username}`);
          navigate(`/channels`, { state: { username } });
        }
        else {
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
    <div id="" className="container">
      <div className="row justify-content-center">
        <div className="col-6 ">
          <form onSubmit={handleLogin}>
            <h1 className="text-center mb-5 mt-5 cool-font-medium">
              Log in to &#129413;
            </h1>
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
                value={username}
                placeholder="username"
                autoComplete="on"
                onChange={(e) => setUsername(e.target.value)}
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
                aria-describedby="passwordHelpBlock"
                placeholder="password"
                value={password}
                autoComplete="on"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-5 custom-button"
                type="button"
                onClick={handleLogin}
              >
                <ToastContainer />
                LOGIN
              </button>
            </div>

            <div className="form-group row p-2 mb-5">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
