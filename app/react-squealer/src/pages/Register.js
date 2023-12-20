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
      position: "top-right",
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
              >Nome</label>
              <input
                type="text"
                name="name"
                className="form-control cool-medium text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputName"
                value={name}
                placeholder="Metti il nome qui"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label
                htmlFor="inputSurname"
                className="form-label cool-font-medium"
              >Cognome</label>
              <input
                type="text"
                name="surname"
                className="form-control cool-medium text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputSurname"
                value={surname}
                placeholder="Metti il cognome"
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label
                htmlFor="inputUsername"
                className="form-label cool-font-medium"
              >Username</label>
              <input
                type="text"
                name="username"
                className="form-control cool-medium text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="inputUsername"
                value={username}
                placeholder="Nome su Squealer"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group row mb-3">
              <label
                htmlFor="email"
                className="form-label cool-font-medium"
              >Email</label>
              <input
                type="text"
                name="email"
                className="form-control cool-medium text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="email"
                value={email}
                placeholder="you@esempio.it"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group row">
              <label
                htmlFor="inputPassword5"
                className="form-label cool-font-medium"
              >Password</label>
              <input
                type="password"
                name="password"
                className="form-control cool-medium text-center box"
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
                className="form-control cool-medium text-center box"
                id="inputReset"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                value={reset}
                placeholder="Passatempo qui"
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
              <NavLink
                style={{ color: "#e0bb76", textDecoration: "none" }}
                to={ReactConfig.pathFunction("/")}
                aria-label="clicca se vuoi tornare alla pagina precedente"
              >
                <button className="col-12 col-md-4 offset-md-4 mb-5 red-button box cool-font-medium w-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                    />
                  </svg>
                </button>
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
