import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

//import { response } from "../../../drivers/views/viewAdminDriver";
//import "../LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleUsernameChange(event){
    setUsername(event.target.value);
  }

  function handlePasswordChange(event){
    setPassword(event.target.value);
  }

  const handleLogin = () => {
    //navigate('/home'); This code is dangerous cause after using it the browser can stop the execution of the code
    //send a POST to driver
    //const data = { nome: username, password: password }; //nope. According to Swagger specifics, the username is sent in path, with the requested role.
    const data = {password: password }; //nope. According to Swagger specifics, the username is sent in path, with the requested role.
    //URI: where I want ot send the POST: viewDriver
    //@romanellas comment. No u should send post to authDriver
    let uri = `${ReactConfig.base_url_requests}/auth/${username}/0`;
    console.log(uri);
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`home`);
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
                onChange={handleUsernameChange}
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
                onChange={handlePasswordChange}
              />
              <div id="passwordHelpBlock" class="form-text p-2">
                vincoli sulla password
              </div>

              <button type="button" onClick={handleLogin}>
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
