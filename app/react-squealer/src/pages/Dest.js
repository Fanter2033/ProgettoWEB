import React from "react";
import { useState } from "react";
import "../css/App.css";

//TODO: CHECK SE DEST ESISTE?
const Dest = ({ onDestinatariSubmit }) => {
  const [destinatari, setDestinatari] = useState("");
  const [destinatariArray, setDestinatariArray] = useState([]);
  const [error, setError] = useState("");

  const handleDestinatariChange = (e) => {
    const destinatariText = e.target.value;
    setDestinatari(destinatariText);
    setError("");
  };

  const handleDestinatariSubmit = (e) => {
    e.preventDefault();

    // Suddivide l'input in destinatari separati da virgole
    const destinatariSeparati = destinatari
      .split(",")
      .map((destinatario) => destinatario.trim());

    const isValid = destinatariSeparati.every((destinatario) =>
      /^[@#§]/.test(destinatario)
    );

    if (!isValid) {
      setError("Ogni destinatario deve iniziare con uno dei simboli: #, §, @");
      return;
    }

    setDestinatariArray(destinatariSeparati);

    // Passa l'array alla componente padre
    onDestinatariSubmit(destinatariSeparati);
  };

  const handleResetDestinatari = () => {
    setDestinatari("");
    setDestinatariArray([]);
    setError("");
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {destinatariArray.length > 0 && (
        <div>
          <ul className="list-unstyled">
            {destinatariArray.map((destinatario, index) => (
              <li key={index}>{destinatario}</li>
            ))}
          </ul>

          <button className="btn btn-danger" onClick={handleResetDestinatari}>
            Resetta
          </button>
        </div>
      )}
    </div>
  );
};

export default Dest;
