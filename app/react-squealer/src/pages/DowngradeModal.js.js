import React from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

function DowngradeModal({ downgrade, closeDowngrade }) {
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
          <Modal.Title className="cool-font-small" style= {{color:"#e0bb76"}}>
            DOWNGRADE ACCOUNT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <p className="custom-modal-text cool-font-medium">
            Torna ad essere <span className="luminescent-word">USER</span>
          </p>
          <ul className="custom-modal-list cool-font-text wrap">
            Potrai cambiare nome <br />
            MA
            <br /> Perderai il pagamento effettuato e tutti i vantaggi
            dell'account VIP. <br />
            Questa azione è irreversibile.
            <br /> Sicuro di voler procedere?
          </ul>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button
            className="upgrade-button cool-font-medium h-50"
            onClick={handelDowngrade}
          >
            DOWNGRADE
          </button>
          <button
            className="blue-button cool-font-medium w-100"
            onClick={closeDowngrade}
          >
            CHIUDI
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DowngradeModal;
