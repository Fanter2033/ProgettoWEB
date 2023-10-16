import React, { useState } from "react";
//import { response } from "../../../drivers/views/viewAdminDriver";
//import "../LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  //TODO: far funzionare this shit
  //dovrebbe portarmi sulla home quando clicco login

  const handleLogin = () => {
    navigate('/home');
    //send a POST to driver
    const data = { nome: username, password: password };
    //URI: where I want ot send the POST: viewDriver
    fetch("/viewDriver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful", data);
        } else {
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  };

  //reminder: input tag in React <input/>
  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-6 ">
          <form onSubmit={handleLogin}>
            <h1 class="text-center">Hi, log in bitch!</h1>
            <div class="form-group row p-2">
              <label for="inputUsername" class="form-label">
                Username
              </label>
              <input
                type="text"
                class="form-control"
                id="inputUsername"
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div class="form-group row p-2">
              <label for="inputPassword5" class="form-label">
                Password
              </label>
              <input
                type="password"
                id="inputPassword5"
                class="form-control"
                aria-describedby="passwordHelpBlock"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div id="passwordHelpBlock" class="form-text p-2">
                vincoli sulla password
              </div>

              <button type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
