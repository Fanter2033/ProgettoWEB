import React from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";


function VipModal({ showModal, handleClose }) {

  const { userGlobal } = useUserContext();

  const handleUpgrade = () => {
    // Simulazione di una richiesta al server per il pagamento
    simulatePaymentRequest()
      .then((response) => {
        alert("Pagamento effettuato con successo!");
        handleClose(); 
        const data = {
          user: {
            username: userGlobal.name,
            email: userGlobal.email,
            firstname: userGlobal.first_name,
            lastname: userGlobal.last_name,
            password: userGlobal.password,
            isMod: false,
            isSmm: false,
            isUser: true,
            vip: true,
          },
        };

        const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
        const options = {
          method: "PUT",
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
        userGlobal.vip=true;
      })
      .catch((error) => {
        //non si verifca MAI: server di migliore qualità
        alert("Errore durante il pagamento. Riprova più tardi.");
      });
  };

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

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title className="">Upgrade Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <p className="custom-modal-text cool-font-medium">
            Diventa <span class="luminescent-word">VIP</span>
          </p>
          <ul className="custom-modal-list cool-font-small">
            <li>Funzioni extra di geolocazione.</li>
            <li>Managment della quota avanzato.</li>
            <li>Squealer badge.</li>
            <li>Il tuo nome è per sempre.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="my-foot" style={footerStyle}>
          <button className="user_button" onClick={handleClose}>
            Chiudi
          </button>
          <button className="upgrade-button" onClick={handleUpgrade}>
            Upgrade
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VipModal;
