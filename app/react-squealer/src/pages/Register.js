import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
  const [reset, setReset] = useState("");

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
      password: password,
      reset: reset,
    });

    //se i campi sono vuoti apri modale
    if (
      name.trim() === "" ||
      surname.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      reset.trim() === ""
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
            reset: reset,
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
            if (res.ok) {
              //registration ok
              return res.json();
            }
          })
          .then((data) => {
            setName("");
            setSurname("");
            setEmail("");
            console.log("Registration went good", data);

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
                navigate(`./received`);
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
        <h1 className="text-center mt-3 cool-font animated-title">Benvenuti</h1>
        <h1 className="animated-squeal cool-font" aria-label="Squealer">
          su &#129413;
        </h1>

        <div className="animated-title col-6 ">
          <form onSubmit={handleRegistration}>
            <div className="form-group row mb-3">
              <label
                htmlFor="inputName"
                className="form-label cool-font-medium"
              >
              </label>
              <input
                type="text"
                name="name"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputName"
                value={name}
                placeholder="Nome"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label
                htmlFor="inputSurname"
                className="form-label cool-font-medium"
              >
              </label>
              <input
                type="text"
                name="surname"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputSurname"
                value={surname}
                placeholder="Cognome"
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-medium"
              >
              </label>
              <input
                type="text"
                name="username"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputUsername"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="email" className="form-label cool-font-medium">
              </label>
              <input
                type="text"
                name="email"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-medium"
              >
              </label>
              <input
                type="password"
                name="password"
                className="form-control cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputPassword"
                value={password}
                aria-describedby="passwordHelpBlock"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mt-3 mb-3 cool-font-link  ">
              <h3 className="text-wrap cool-font-medium">
                Qual è il tuo passatempo preferito?
              </h3>

              <label
                htmlFor="inputPassword5"
                className="form-label  d-flex flex-col justify-content-center align-items-center"
              >
                Questa risposta serve
                <br />
                per il reset password
                <br />
                Presta attenzione!
              </label>
              <input
                type="text"
                name="reset"
                className="form-control cool-font-text text-center box"
                id="inputReset"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                value={reset}
                placeholder="Passatempo"
                onChange={(e) => setReset(e.target.value)}
                required
              />
            </div>

            <div className="form-group row p-2">
              <button
                className="col-12 col-md-4 offset-md-4 mb-3 green-button cool-font-medium box"
                type="button"
                onClick={handleRegistration}
              >
                <ToastContainer />
                REGISTRATI
              </button>
              <button className="col-12 col-md-4 offset-md-4 mb-5 red-button box cool-font-medium">
                <NavLink
                  style={{ color: "#e0bb76" }}
                  to={ReactConfig.pathFunction("/")}
                >
                  INDIETRO
                </NavLink>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
