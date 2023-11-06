import React, { useState, useEffect } from "react";

function Geo() {
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
        }
      } catch (error) {
        console.error("Errore:", error);
      } finally {
        setLoading(false);
      }
    }

    getGeolocation();
  }, []);

  //  <p>Geolocalizzazione:</p>

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
