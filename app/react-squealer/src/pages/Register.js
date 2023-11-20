import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../css/LoginForm.css";

/*
accessibilità:
1. htmlFor nella label
2. id e name nel type
3. aria-label or aria-labelledby when necessary
4. <fieldset>
    <legend>Address Information</legend>
  </fieldset>
5. tabindex
6. clear validation feedback 
  preferably using the <span> element to contain the message 
  and setting aria-live="polite" for dynamic validation messages.
7. Error Handling
8. Keyboard Navigation
*/

function Register() {
  const navigate = useNavigate();
  const { userGlobal, setUserGlobal } = useUserContext();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notify = () =>
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

  const handleRegistration = async (e) => {
    //prevent a browser reload/refresh.
    e.preventDefault();

    setUserGlobal({
      ...userGlobal,
      username: username,
      firstname: name,
      surname: surname,
      email: email,
      password: password
    });

    console.log("GLOBALEEEEEEEEEEEEEEE"+userGlobal);


    //se i campi sono vuoti apri modale
    if (
      name.trim() === "" ||
      surname.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      notify();
    } else {
      try {
        //createUser
        const data = {
          user: {
            username: username,
            email: email,
            firstname: name,
            lastname: surname,
            password: password,
            isMod: false,
            isSmm: false,
            isUser: true,
          },
        };

        const url = `${ReactConfig.base_url_requests}/user`;
        const options = {
          method: "POST",
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
              //registration ok
              return res.json();
            }
          })
          .then((data) => {
            setName("");
            setSurname("");
            setEmail("");
            console.log("Registrazione went good", data);

            //authenticateUserconst
            const authData = { password: password };
            const authUrl = `${ReactConfig.base_url_requests}/auth/${username}/0`;
            const authOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              mode: "cors",
              body: JSON.stringify(authData),
            };

            fetch(authUrl, authOptions)
              .then((resAuth) => {
                if (resAuth.ok) {
                  //sessione riuscita
                  return resAuth.json();
                }
              })
              .then((dataAuth) => {
                navigate(`/channels`);
                setUsername("");
                setPassword("");
                console.log("Authentication successful", dataAuth);
              })
              .catch((errorAuth) => {
                console.error("Authentication failed, error:", errorAuth);
              });
          })
          .catch((error) => {
            console.error("Registration failed, error:", error);
          });
      } catch (error) {
        //fail createUser
        console.error(error);
      }
    }
  };

  //le graffe nel return servono a condizionare la renderizzazione
  //reminder: input tag in React <input/>
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-6 ">
          <form onSubmit={handleRegistration}>
            <h1 className="text-center mb-5 mt-5 cool-font-medium">
              Register to &#129413;
            </h1>

            <div className="form-group row p-2 mb-3">
              <label htmlFor="inputName" className="form-label cool-font-small">
                Nome
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="inputName"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label
                htmlFor="inputSurname"
                className="form-label cool-font-small"
              >
                Cognome
              </label>
              <input
                type="text"
                name="surname"
                className="form-control"
                id="inputSurname"
                value={surname}
                placeholder="Cognome"
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-small"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control"
                id="inputUsername"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group row p-2 mb-3">
              <label htmlFor="email" className="form-label cool-font-small">
                Email
              </label>
              <input
                type="text"
                name="email"
                className="form-control"
                id="email"
                value={email}
                placeholder="nomecognome@example.it"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group row p-2">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-small"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="inputPassword"
                value={password}
                aria-describedby="passwordHelpBlock"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div id="passwordHelpBlock" className="form-text p-2 mb-5">
                Vincoli sulla password
              </div>
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-5 custom-button"
                type="button"
                onClick={handleRegistration}
              >
                <ToastContainer />
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
