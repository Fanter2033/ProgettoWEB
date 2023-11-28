import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function RenderMap({ coordinates }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      console.error("Coordinate non valide.");
      return;
    }

    // inizializza
    const map = L.map(mapContainerRef.current).setView(coordinates, 13);

    // mappa di base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // marker alla posizione specificata
    L.marker(coordinates).addTo(map);
  }, [coordinates]);

  return <div ref={mapContainerRef} style={{ height: "400px" }} />;
}

export default RenderMap;
