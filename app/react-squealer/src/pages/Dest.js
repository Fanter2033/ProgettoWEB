import React from "react";
import { useState } from "react";
import "../css/App.css";

const Dest = () => {
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
    setDestinatariArray(destinatariSeparati);
  };

  const handleResetDestinatari = () => {
    setDestinatari("");
    setDestinatariArray([]);
  };

  const getDestinatarioClass = (destinatario) => {
    if (destinatario.startsWith("@")) {
      return "persona";
    } else if (destinatario.startsWith("§")) {
      return "qualcosaltro1";
    } else if (destinatario.startsWith("#")) {
      return "qualcosaltro2";
    } else {
      return "qualcosaltro2";
    }
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
              <li key={index} className={getDestinatarioClass(destinatario)}>
                {destinatario}
              </li>
            ))}
          </ul>
          <button
            className="btn btn-danger mb-5"
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
