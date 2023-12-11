import React from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";

function VipModal({ showModal, handleClose }) {
  const { userGlobal } = useUserContext();

  const simulatePaymentRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0; // pagamento riuscito il 100% delle volte
        if (success) {
          resolve("Pagamento riuscito");
        } else {
          reject("Pagamento fallito");
        }
      }, 1000);
    });
  };

  const handleUpgrade = () => {
    simulatePaymentRequest()
      .then((response) => {
        alert("Pagamento effettuato con successo!");
        handleClose();

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
            console.log("Upgrade went good", data);
          })
          .catch((error) => {
            console.error("Upgrade failed, error:", error);
          });
        userGlobal.vip = true;
      })
      .catch((error) => {
        //non si verifca MAI: server di migliore qualità
        alert("Errore durante il pagamento. Riprova più tardi.");
      });
  };

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title
            className="cool-font-medium"
            style={{ color: "#e0bb76" }}
          >
            UPGRADE ACCOUNT
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <ul
            className="custom-modal-list cool-font-small"
            style={{ color: "#072f38" }}
          >
            <li className="cool-font-medium">DIVENTA VIP</li>
            <li>COSA OTTIENI?</li>
            <li>Squealer badge.</li>
            <li>Il tuo nome è per sempre.</li>
            <li>Possibilità di comprare quota.</li>
            <li>Potrai collegarti a un Social Media Manager</li>
            <li>che si occuperà della gestione del tuo profilo.</li>
            <li>OPPURE</li>
            <li>Diventa tu stesso un SMM.</li>
            <br/>
            <li>NB: I RUOLI NON POSSONO COESITERE PER LO STESSO ACCOUNT</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button className="upgrade-button cool-font-medium" onClick={handleUpgrade}>
            UPGRADE
          </button>
          <button className="custom-button cool-font-medium w-100" onClick={handleClose}>
            CHIUDI
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VipModal;
