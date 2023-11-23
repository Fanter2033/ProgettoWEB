import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

function VipModal({ buyModal, closeBuyModal, userQuote }) {
  const { userGlobal } = useUserContext();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCheckboxChange = (cardId) => {
    setSelectedCard(cardId);
  };

  const [percentualeAumento, setPercentualeAumento] = useState("");
  const [risultatoG, setRisultatoG] = useState(null);
  const [risultatoS, setRisultatoS] = useState(null);
  const [risultatoM, setRisultatoM] = useState(null);

  const handlePercentualeChange = (e) => {
    setPercentualeAumento(e.target.value);
  };

  //!quote
  //! aumento: 10%, 30%, 50%
  //TODO: PATCH USER QUOTE /user/${username}/quote     when BUY is clicked percentageeeee-----------------------------------------------------------------------------------------------
  /*
  const simulatePaymentRequest = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0;
        if (success) {
          resolve("Pagamento riuscito");
        } else {
          reject("Pagamento fallito");
        }
      }, 1000);
    });
  };
*/

  async function buyQuote(e) {
    alert("SIMULA PAGAMENTO CON SUCCESSO");
    e.preventDefault();

    if (selectedCard !== null) {
      console.log(`Card ${selectedCard} selected!`);
      // You can do more here with the selected card, e.g., update state, send to server, etc.
    } else {
      console.log('Please select a card before performing an action.');
    }
    /*
    simulatePaymentRequest()
      .then((response) => {
        alert("Pagamento effettuato con successo!");

        //TODO:body of squeal
        const data = {
          quote: {},
        };

        const url = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/quote`;
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
*/
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  /*
   {risultatoG !== null && risultatoS !== null && risultatoM !== null (
   <div>
     <h3>Risultato:</h3>
     <p>Nuova Quota Giornaliera: {risultatoG}</p>
     <p>Nuova Quota Settimanale: {risultatoS}</p>
     <p>Nuova Quota Mensile: {risultatoM}</p>
   </div>
 )}
  */

  return (
    <div>
      <Modal show={buyModal} onHide={closeBuyModal} centered>
        <Modal.Header closeButton className="modal-buy-header">
          <Modal.Title className="">Buy Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-buy-body">
          <div className="m-3">
            <div class="card text-center">
              <div class="card-header">PACCHETTO 1</div>
              <div class="card-body">
                <h5 class="card-title">Aumento del 10%</h5>
              </div>
              <div class="card-footer text-muted">
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
            <div class="card text-center">
              <div class="card-header">PACCHETTO 2</div>
              <div class="card-body">
                <h5 class="card-title">Aumento del 30%</h5>
              </div>
              <div class="card-footer text-muted">
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
            <div class="card text-center">
              <div class="card-header">PACCHETTO 3</div>
              <div class="card-body">
                <h5 class="card-title">Aumento del 50%</h5>
              </div>
              <div class="card-footer text-muted">
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
          <button className="blue-button box" onClick={closeBuyModal}>
            Annulla
          </button>
          <button className="green-button box" onClick={buyQuote}>
            Compra
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VipModal;
