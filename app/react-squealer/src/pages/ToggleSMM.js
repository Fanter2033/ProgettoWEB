import React, { useState } from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

const ToggleSMM = ({ onCliccato }) => {
  const { userGlobal } = useUserContext();
  const [isSMM, setSMM] = useState(false);

  async function becomeSMM() {
    const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}/toggle/smm`;
    const options = {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    await fetch(uri, options)
      .then((response) => {
        if (response.ok) {
          console.log(response);
          console.log("SMM CHANGED CORRECTLY");
        } else {
          console.error("Authentication failed", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Network error", error);
      });
  }

  const handleToggleClick = () => {
    setSMM(!isSMM);
    becomeSMM();
    onCliccato(isSMM);
  };

  const buttonText = isSMM ? "SONO SMM" : "NON SONO SMM";

  const buttonClass = isSMM ? '' : 'toggled';

  return (
    <button onClick={handleToggleClick} className={`toggle-button ${buttonClass} w-50 box`} >
      {buttonText}
    </button>
  );
};

export default ToggleSMM;
