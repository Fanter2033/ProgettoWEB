import React, { useState, useEffect } from "react";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import "../css/App.css";

const ToggleSMM = ({ mongoData }) => {
  const { userGlobal } = useUserContext();
  const [isSMM, setSMM] = useState(mongoData);

  //GET USER DATA-----------------------------------------------------------------------------------------------
  const [userData, setUserData] = useState("");

  async function getUserData() {
    try {
      const uri = `${ReactConfig.base_url_requests}/user/${userGlobal.username}`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      };

      let result = await fetch(uri, options);

      if (result.ok) {
        let data = await result.json();
        console.log(data);
        setUserData(data);
        return data;
      } else {
        console.error("Errore nella richiesta:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
  }
  //console.log(userData);

  async function becomeSMM() {
    const uri = `${ReactConfig.base_url_requests}/user/${userData.username}/toggle/smm`;
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
  };

  useEffect(() => {
    getUserData();
    const intervalId = setInterval(getUserData, 10000); //10 sec
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const buttonText = isSMM ? "SONO SMM" : "NON SONO SMM";

  const buttonClass = isSMM ? "" : "toggled";

  return (
    <button
      onClick={handleToggleClick}
      className={`toggle-button ${buttonClass} w-50 box`}
    >
      {buttonText}
    </button>
  );
};

export default ToggleSMM;
