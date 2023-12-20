import React from "react";
import ReactConfig from "../config/ReactConfig";
import { useState } from "react";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

function VipModal({ onInternalButtonClick, closeBuyModal }) {
  const { userGlobal } = useUserContext();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCheckboxChange = (cardId) => {
    setSelectedCard(cardId);
  };

  //*PATCH USER QUOTE /user/${username}/quote/buy     when BUY is clicked percentageeeee----------------------------------------------------------------------------------------------

  async function buyQuote(e) {
    e.preventDefault();

    if (selectedCard !== null) {
      console.log(`Card ${selectedCard} selected!`);

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
      //console.log("aumento", increment);

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
            onInternalButtonClick();
          } else {
            console.error("Aumento fallito", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Network error", error);
        });
    } else {
      console.log("Please select a card before performing an action.");
    }
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <div>
      <Modal show={true} onHide={closeBuyModal} centered>
        <Modal.Header closeButton className="modal-change-header">
          <Modal.Title className="cool-font-link" style={{ color: "#e0bb76" }}>
            BUY QUOTE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-change-body cool-font-link">
          <div className="m-3">
            <div className="card text-center offers">
              <div className="card-header">PACCHETTO 1</div>
              <div className="card-body p-2">
                <h5 className="card-title">AUMENTO DEL 10%</h5>
                <h5 className="card-title">COSTO: 5,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 1}
                    onChange={() => handleCheckboxChange(1)}
                  />
                  PRIMO
                </label>
              </div>
            </div>
          </div>
          <div className="m-3">
            <div className="card text-center offers">
              <div className="card-header">PACCHETTO 2</div>
              <div className="card-body p-2">
                <h5 className="card-title">AUMENTO DEL 30%</h5>
                <h5 className="card-title">COSTO: 12,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 2}
                    onChange={() => handleCheckboxChange(2)}
                  />
                  SECONDO
                </label>
              </div>
            </div>
          </div>
          <div className="m-3">
            <div className="card text-center offers">
              <div className="card-header">PACCHETTO 3</div>
              <div className="card-body p-2">
                <h5 className="card-title">AUMENTO DEL 50%</h5>
                <h5 className="card-title">COSTO: 24,00€</h5>
              </div>
              <div className="card-footer text-muted">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCard === 3}
                    onChange={() => handleCheckboxChange(3)}
                  />
                  TERZO
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="my-foot d-flex justify-content-center cool-font-small "
          style={footerStyle}
        >
          <button className="green-button box w-100" onClick={buyQuote}>
            PAGA
          </button>
          <button className="blue-button box w-100" onClick={closeBuyModal}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VipModal;
