import React from "react";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet/dist/leaflet.css";

const MapWithSearch = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize the map

    let mapInstance = L.map("map").setView([41.8719, 12.5674], 5);
    setMap(mapInstance);

    // Add a tile layer (you can use any tile layer you prefer)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    // Create a search control
    const searchControl = L.Control.extend({
      options: {
        position: "topleft",
      },

      onAdd: function (map) {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );

        container.innerHTML =
          '<input type="text" id="searchInput" placeholder="Cerca..." style="width:150px;" />';

        container.onclick = function () {
          // Prevent map click event when clicking on the search input
          L.DomEvent.stopPropagation(container);
        };

        return container;
      },
    });

    // Add the search control to the map
    mapInstance.addControl(new searchControl());

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        const searchString = e.target.value;

        const geocodingService = L.Control.Geocoder.nominatim({ language: "it" }); // Imposto la lingua italiana
        geocodingService.geocode(searchString, (results) => {
          if (results.length > 0) {
            const { lat, lon } = results[0].center;

            if (lat !== undefined && lon !== undefined) {
              mapInstance.setView([lat, lon], 13);
              L.marker([lat, lon]).addTo(mapInstance).bindPopup(`Luogo cercato: ${searchString}`).openPopup();
            } else {
              console.error("Coordinate non valide:", results[0].center);
            }
          }
        });
      });
    }
    // Cleanup function to remove the map when the component unmounts
    return () => {
        mapInstance.remove();
    };
  }, []);

  return <div id="map" style={{ height: "400px" }} />;
};

export default MapWithSearch;
