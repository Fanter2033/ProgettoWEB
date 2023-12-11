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
    <div className="">
      <form onSubmit={handleDestinatariSubmit} className="row d-flex align-items-center p-1 mb-0">
        <div className="col-10">
          <label
            htmlFor="destinatariInput"
            className="form-label cool-font-details-md"
          >
            DESTINATARI
          </label>
          <input
            style={{ color: "#072f38", backgroundColor: "#528b57" }}
            type="text"
            className="form-control box cool-font-link"
            id="destinatariInput"
            value={destinatari}
            onChange={handleDestinatariChange}
          />
          <p className="text-wrap cool-font-details mt-1">
            INSERISCILI SEPARATI DA VIRGOLE
          </p>
        </div>

        <div className="col-2 mb-4 ">
          <button
            type="submit"
            className="bottoni_omologati center box cool-font-medium text-center"
          >
            +
          </button>
        </div>
      </form>
      {error && (
        <p
          style={{ color: "#b45656", whiteSpace: "wrap" }}
          className="cool-font-link"
        >
          {error}
        </p>
      )}
      {destinatariArray.length > 0 && (
        <div className="row d-flex justify-content-center align-items-center">
          <ul className="list-unstyled">
            {destinatariArray.map((destinatario, index) => (
              <li className="cool-font-details-md" key={index}>{destinatario}</li>
            ))}
          </ul>

          <button
            className="reset-button box cool-font-medium mb-4"
            onClick={handleResetDestinatari}
          >
            RESETTA
          </button>
        </div>
      )}
    </div>
  );
};

export default Dest;
