import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
//import { Link } from "react-router-dom";
import "../LoginForm.css";

//import { response } from "../../../drivers/views/viewAdminDriver";
//import "../LoginForm.css";

//TODO: impedire ereditarietà della navbar
//TODO: manda i dati al driver, onClick del button

//radio button: does one have to be clicked or not?
//do we want to put some constraints on the password or not?

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const handleLogin = () => {
    //navigate('/home'); This code is dangerous cause after using it the browser can stop the execution of the code
    //send a POST to driver
    //const data = { nome: username, password: password }; //nope. According to Swagger specifics, the username is sent in path, with the requested role.
    const data = { password: password }; //nope. According to Swagger specifics, the username is sent in path, with the requested role.
    //URI: where I want ot send the POST: viewDriver
    //@romanellas comment. No u should send post to authDriver
    let uri = `${ReactConfig.base_url_requests}/auth/${username}/0`;
    console.log(uri);
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`channles`);
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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-6 ">
          <form onSubmit={handleLogin}>
            <h1 className="text-center mb-5 mt-5 cool-font-medium">
              Register to &#129413;
            </h1>

            <div className="form-group row p-2 mb-3">
              <label for="inputName" className="form-label cool-font-small">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                placeholder="Name"
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label for="inputSurname" className="form-label cool-font-small">
                Cognome
              </label>
              <input
                type="text"
                className="form-control"
                id="inputSurname"
                placeholder="Cognome"
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label for="inputUsername" className="form-label cool-font-small">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                value={username}
                placeholder="Username"
                onChange={handleUsernameChange}
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label for="email" className="form-label cool-font-small">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="nomecognome@example.it"
              />
            </div>

            <div className="form-group row p-2">
              <label
                for="inputPassword5"
                className="form-label cool-font-small"
              >
                Password
              </label>
              <input
                type="password"
                id="inputPassword"
                className="form-control"
                aria-describedby="passwordHelpBlock"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <div id="passwordHelpBlock" className="form-text p-2 mb-5">
                Vincoli sulla password
              </div>
            </div>

        
            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-5 custom-button"
                type="button"
                onClick={handleLogin}
              >
                REGISTER
              </button>
            </div>
            <div className="mb-5"></div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
