import React from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

function DowngradeModal({downgrade, closeDowngrade}) {
  const { userGlobal } = useUserContext();

  const handelDowngrade = () => {
    closeDowngrade();

    const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/toggle/vip`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    };

    fetch(url, options)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          //creation ok
          return res.json();
        }
      })
      .then((data) => {
        console.log("Downgrade went good", data);
      })
      .catch((error) => {
        console.error("Downgrade failed, error:", error);
      });
    userGlobal.vip = false;
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={downgrade} onHide={closeDowngrade} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="">Downgrade Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <p className="custom-modal-text cool-font-medium">
            Torna <span className="luminescent-word">USER</span>
          </p>
          <ul className="custom-modal-list">
            <li>Potrai cambiare nome</li>
            <li>MA</li>
            <li>Perderai il pagamento effettuato</li>
            <li>e tutti i vantaggi del VIP</li>
            <li>Potrai cambiare nome</li>
            <li>sicuro di voler procedere?</li>
            <li>Questa azione è irreversibile</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button className="custom-button w-100" onClick={closeDowngrade}>
            Chiudi
          </button>
          <button className="upgrade-button" onClick={handelDowngrade}>
            Downgrade
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DowngradeModal;
