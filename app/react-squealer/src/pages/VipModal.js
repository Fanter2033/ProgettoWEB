import React from "react";
import { Modal, Button } from "react-bootstrap";

function VipModal({ showModal, handleClose }) {
  const handleUpgrade = () => {
    // Simulazione di una richiesta al server per il pagamento
    simulatePaymentRequest()
      .then((response) => {
        // Simula una risposta positiva dal server
        alert("Pagamento effettuato con successo!");
        handleClose(); // Chiudi la modale dopo la simulazione di pagamento
      })
      .catch((error) => {
        // Simula una risposta negativa o gestisce eventuali errori
        alert("Errore durante il pagamento. Riprova più tardi.");
      });
  };

  const simulatePaymentRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // pagamento riuscito il 90% delle volte
        if (success) {
          resolve("Pagamento riuscito");
        } else {
          reject("Pagamento fallito");
        }
      }, 1000); //ritardo nella risposta del server (1 secondo)
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
