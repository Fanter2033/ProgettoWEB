import React from "react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import L from "leaflet";

import { useUserContext } from "../config/UserContext";

import "leaflet-control-geocoder/dist/Control.Geocoder.js";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet/dist/leaflet.css";
import "../css/App.css";
import "./media/MapMarker.png";

const MapComponent = ({ onLocationChange }) => {
  const { userGlobal, setUserGlobal } = useUserContext();

  const skater = new L.Icon({
    iconUrl: require("./media/MapMarker.png"),
    iconSize: [25, 25],
  });

  //London
  //const latitude = 51.505;
  //const longitude = -0.09;
  //const position = [latitude, longitude];

  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userLocation);
          onLocationChange(userLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="map__container d-flex flex-row justify-content-center ">
      <div
        className="mt-3 borderedImage box"
        style={{ height: "300px", width: "100%" }}
      >
        <MapContainer
          center={userLocation || [41.8719, 12.5674]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation && (
            <Marker position={userLocation} icon={skater}>
              <Popup>Your Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
