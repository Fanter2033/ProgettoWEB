import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

function ConnectSMM({ openConnect, closeConnect }) {
  const { userGlobal } = useUserContext();

  const [smm, setSmm] = useState("");
  const handleInputChange = (event) => {
    setSmm(event.target.value);
  };

  //TODO: PATCH /user/{username}/pick-smm/{smm} ----------------------------------------------------------------------------------------------------------
  async function addSmm() {
    const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/pick-smm/${smm}`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          closeConnect();
        } else {
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  //TODO: PATCH /user/{username}/remove-smm -----------------------------------------------------------------------------------------------------
  async function removeSmm() {
    const uri2 = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/remove-smm`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri2, options)
      .then((response) => {
        if (response.ok) {
          console.log("smm removed successfully");
        } else {
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={openConnect} onHide={closeConnect} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="">Manage SMM here</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="row d-flex justify-content-center">
            <div className="col-6">
              <form onSubmit={addSmm}>
                <label className="">
                  Connetti il tuo SMM
                </label>
                <input type="text" value={smm} onChange={handleInputChange} />

                <button type="submit" className="custom-button box mt-2">
                  SÌ, SMM
                </button>
              </form>
            </div>
            <p className="mt-4">Remove SMM</p>
            <button className="custom-button mb-2 box w-25" onClick={removeSmm}>
              NO SMM
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button className="upgrade-button" onClick={closeConnect}>
            Chiudi
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ConnectSMM;
