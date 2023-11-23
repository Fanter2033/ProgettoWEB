import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapWithMarker = ({ onMarkerAdded }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    let mapInstance = L.map("map").setView([41.8719, 12.5674], 5);
    setMap(mapInstance);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    const markerIcon = new L.Icon({
      iconUrl: require("./media/icone/geo.png"),
      iconSize: [25, 25],
    });

    // Creazione del marker con l'icona personalizzata
    const marker = L.marker([0, 0], { icon: markerIcon }).addTo(mapInstance);

    mapInstance.on("click", function (e) {
      
      const { lat, lng } = e.latlng;

      // Aggiorna la posizione del marker
      setMarkerPosition({ lat, lng });

      // Aggiorna la posizione del marker sulla mappa
      marker.setLatLng([lat, lng]);

      // Richiama la funzione di callback per passare le informazioni alla componente padre
      onMarkerAdded({ lat, lng });
    });

    // Cleanup function per rimuovere la mappa quando la componente è smontata
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [onMarkerAdded]); // Dipendenza: la funzione di callback

  return <div id="map" style={{ height: "400px" }} />;
};

export default MapWithMarker;
