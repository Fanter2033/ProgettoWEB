import React, { useState } from "react";

function MenuTag({ onOrderChange }) {
  const [selectedOption, setSelectedOption] = useState(""); // Stato per tenere traccia dell'opzione s
  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onOrderChange(selectedValue); // Passa l'opzione selezionata al genitore
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center cool-font-details">
      {" "}
      <label htmlFor="orderOptions">Seleziona l'ordine:</label>
      <select
        id="orderOptions"
        style={{ height: "20%", width:"70%", borderRadius: "0.5rem" }}

        value={selectedOption}
        onChange={handleOptionChange}
      >
        <option value="">OPZIONI</option>
        <option value="CHANNEL_HASHTAG">TEMPORALE</option>
        <option value="CHANNEL_HASHTAG?orderBy=channel_name&orderDir=ORDER_ASC">
          NOME CRESCENTE
        </option>
        <option value="CHANNEL_HASHTAG?orderBy=channel_name&orderDir=ORDER_DESC">
          NOME DECRESCENTE
        </option>
      </select>
    </div>
  );
}

export default MenuTag;
