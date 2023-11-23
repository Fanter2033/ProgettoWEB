import React, { useState, useEffect } from "react";
import { useUserContext } from "../config/UserContext";
import "../css/App.css";

function Geo() {
  const { userGlobal, setUserGlobal } = useUserContext();
  const [geolocationData, setGeolocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getGeolocation() {
      try {
        const response = await fetch(
          "https://ipinfo.io/json?token=ff2dd590e30594"
        );
        if (response.ok) {
          const data = await response.json();
          setGeolocationData(data);
          //userGlobal.location=locArray;
        }
      } catch (error) {
        console.error("Errore:", error);
      } finally {
        setLoading(false);
      }
    }

    getGeolocation();
  });
  //const locString = geolocationData.loc;
  //console.log(geolocationData.loc);
  //const locArray = locString.split(",").map(Number);
  //console.log("aaaaaaaaaaaaaaaaa",locArray);


  return (
    <div>
      {loading ? (
        <p>Caricamento...</p>
      ) : geolocationData ? (
        <div>
          <ul className="list-unstyled">
            <li>IP: {geolocationData.ip}</li>
            <li>Città: {geolocationData.city}</li>
            <li>Regione: {geolocationData.region}</li>
            <li>Paese: {geolocationData.country}</li>
            <li>Coordinate: {geolocationData.loc}</li>
          </ul>
        </div>
      ) : (
        <p>Impossibile ottenere i dati di geolocalizzazione.</p>
      )}
    </div>
  );
}

export default Geo;
