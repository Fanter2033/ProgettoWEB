import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

function VipModal({ buyModal, closeBuyModal }) {
  const { userGlobal } = useUserContext();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCheckboxChange = (cardId) => {
    setSelectedCard(cardId);
  };

  //*PATCH USER QUOTE /user/${username}/quote/buy     when BUY is clicked percentageeeee-----------------------------------------------------------------------------------------------
  const simulatePaymentRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0;
        closeBuyModal();
        if (success) {
          alert("Pagamento riuscito");
        } else {
          alert("Pagamento fallito");
        }
      }, 1000);
    });
  };

  async function buyQuote(e) {
    e.preventDefault();

    if (selectedCard !== null) {
      console.log(`Card ${selectedCard} selected!`);
    } else {
      console.log("Please select a card before performing an action.");
    }
    simulatePaymentRequest()
      .then((response) => {
        var increment = 100;
        if (selectedCard === 1) {
          increment = increment + 10;
        }
        if (selectedCard === 2) {
          increment = increment + 30;
        }
        if (selectedCard === 3) {
          increment = increment + 50;
        }
        const data = {
          percentage: increment,
        };

        const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/quote/buy`;
        const options = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(data),
        };

        fetch(url, options)
          .then((response) => {
            if (response.ok) {
              console.log("Aumento riuscito con successo");
            } else {
              console.error("Aumento fallito", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Network error", error);
          });
      })
      .catch((error) => {
        alert("Errore durante il pagamento. Riprova più tardi.");
      });
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={buyModal} onHide={closeBuyModal} centered>
        <Modal.Header closeButton className="modal-buy-header">
          <Modal.Title className="">Buy Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-buy-body">
          <div className="m-3">
            <div className="card text-center">
              <div className="card-header">PACCHETTO 1</div>
              <div className="card-body">
                <h5 className="card-title">Aumento del 10%</h5>
                <h5 className="card-title">Costo: 5,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 1}
                    onChange={() => handleCheckboxChange(1)}
                  />
                  Card 1
                </label>
              </div>
            </div>
          </div>
          <div className="m-3">
            <div className="card text-center">
              <div className="card-header">PACCHETTO 2</div>
              <div className="card-body">
                <h5 className="card-title">Aumento del 30%</h5>
                <h5 className="card-title">Costo: 12,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 2}
                    onChange={() => handleCheckboxChange(2)}
                  />
                  Card 2
                </label>
              </div>
            </div>
          </div>
          <div className="m-3">
            <div className="card text-center">
              <div className="card-header">PACCHETTO 3</div>
              <div className="card-body">
                <h5 className="card-title">Aumento del 50%</h5>
                <h5 className="card-title">Costo: 24,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 3}
                    onChange={() => handleCheckboxChange(3)}
                  />
                  Card 3
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="my-foot d-flex justify-content-center"
          style={footerStyle}
        >
          <button className="green-button box" onClick={buyQuote}>
            COMPRA
          </button>
          <button className="blue-button box" onClick={closeBuyModal}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VipModal;
