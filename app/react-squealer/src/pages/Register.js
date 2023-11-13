import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import "../css/LoginForm.css";

//do we want to put some constraints on the password or not?

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

/*
TODO: cancella componente Modal
import Modal from "./Modal";

 const [showModal, setShowModal] = useState(false);
 const closeModal = () => {
   setShowModal(false);
 };
 const openModal = () => {
   setShowModal(true);
 };

 openModal();

 nel render
 <Modal isOpen={showModal} onClose={closeModal} />
*/

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showToast, setShowToast] = useState(false);

  const handleRegistration = async (e) => {
    //prevent a browser reload/refresh.
    e.preventDefault();

    //se i campi sono vuoti apri modale
    if (
      name.trim() === "" ||
      surname.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      //TODO:capire perchè non compare la modale
      //TODO: usare toast
      setShowToast(true); //TODO IMPLEMENT TOAST
      //alert("completa");
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
            "Access-Control-Allow-Origin": "*",
          },
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
                "Access-Control-Allow-Origin": "*",
              },
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
                REGISTER
              </button>
            </div>
          </form>

          {showToast && (
            <div
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-autohide="false"
            >
              <div className="toast-header">
                <strong className="mr-auto">Error</strong>
                <button
                  type="button"
                  className="ml-2 mb-1 close"
                  data-dismiss="toast"
                  aria-label="Close"
                  onClick={() => setShowToast(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="toast-body">Completa tutti i campi, pls</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
