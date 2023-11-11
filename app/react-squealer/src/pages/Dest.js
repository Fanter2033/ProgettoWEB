import React from "react";
import { useState } from "react";
import "../css/App.css";

const Dest = ({ onDestinatariSubmit }) => {
  const [destinatari, setDestinatari] = useState("");
  const [destinatariArray, setDestinatariArray] = useState([]);

  const handleDestinatariChange = (e) => {
    const destinatariText = e.target.value;
    setDestinatari(destinatariText);
  };

  const handleDestinatariSubmit = (e) => {
    e.preventDefault();

    // Suddivide l'input in destinatari separati da virgole
    const destinatariSeparati = destinatari
      .split(",")
      .map((destinatario) => destinatario.trim());

    const destinatariObjects = destinatariSeparati.map((destinatario) => {
      let destType = "";
      let identifier = "";

      if (destinatario.startsWith("@")) {
        destType = "USER";
        identifier = destinatario.slice(1); // Rimuove il carattere "@"
      } else if (destinatario.startsWith("§")) {
        destType = "CHANNEL";
        identifier = destinatario.slice(1); // Rimuove il carattere "§"
      } else if (destinatario.startsWith("#")) {
        destType = "CHANNEL_TAG";
        identifier = destinatario.slice(1); // Rimuove il carattere "#"
      }

      return { dest_type: destType, identifier };
    });

    setDestinatariArray(destinatariObjects);

    // Passa l'array alla componente padre
    onDestinatariSubmit(destinatariObjects);
  };

  const handleResetDestinatari = () => {
    setDestinatari("");
    setDestinatariArray([]);
  };

  return (
    <div>
      <form onSubmit={handleDestinatariSubmit}>
        <div className="mb-2">
          <label htmlFor="destinatariInput" className="form-label">
            Inserisci i destinatari separati da virgole
          </label>
          <input
            type="text"
            className="form-control"
            id="destinatariInput"
            value={destinatari}
            onChange={handleDestinatariChange}
          />
        </div>
        <button type="submit" className="custom-button">
          Aggiungi
        </button>
      </form>

      {destinatariArray.length > 0 && (
        <div>
          <ul className="list-unstyled">
            {destinatariArray.map((destinatario, index) => (
              <li key={index}>
                {`dest_type: ${destinatario.dest_type}, identifier: ${destinatario.identifier}`}
              </li>
            ))}
          </ul>
          <button
            className="btn btn-danger"
            onClick={handleResetDestinatari}
          >
            Resetta
          </button>
        </div>
      )}
    </div>
  );
};

export default Dest;
