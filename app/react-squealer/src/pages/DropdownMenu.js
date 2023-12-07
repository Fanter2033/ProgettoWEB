import React, { useState } from "react";

const DropdownMenu = ({ onOrderChange }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onOrderChange(selectedValue);
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center cool-font-details">
        <label htmlFor="orderOptions">Seleziona l'ordine:</label>
        <select
          id="orderOptions"
          value={selectedOption}
          onChange={handleOptionChange}
          style={{ height: "20%", width:"70%", borderRadius: "0.5rem" }}
        >
          <option value="">OPZIONI</option>
          <option value="CHANNEL_USERS">TEMPORALE</option>
          <option value="CHANNEL_USERS?orderBy=private&orderDir=ORDER_ASC">
            PUBBLICI
          </option>
          <option value="CHANNEL_USERS?orderBy=private&orderDir=ORDER_DESC">
            PRIVATI
          </option>
          <option value="CHANNEL_USERS?orderBy=channel_name&orderDir=ORDER_ASC">
            NOME CRESCENTE
          </option>
          <option value="?orderBy=channel_name&orderDir=ORDER_DESC">
            NOME DECRESCENTE
          </option>
        </select>
      </div>
    </>
  );
};

export default DropdownMenu;
