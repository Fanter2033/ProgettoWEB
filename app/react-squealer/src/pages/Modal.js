import React from "react";

function Modal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  } else {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="modal-close" onClick={onClose}>
            Chiudi
          </button>
          <div className="modal-content">
            <p>Per favore, completa tutti i campi del modulo.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
