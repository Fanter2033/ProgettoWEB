import React from "react";
// import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  //useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import { useUserContext } from "../config/UserContext";

//import { SearchControl, OpenStreetMapProvider } from "react-leaflet-geosearch";
//import "leaflet-control-geocoder/dist/Control.Geocoder.js";

//import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet/dist/leaflet.css";
import "../css/App.css";

const MapComponent = () => {
  const { userGlobal, setUserGlobal } = useUserContext();

  const skater = new L.Icon({
    iconUrl: require("./media/icone/geo.png"),
    iconSize: [25, 25],
  });

  //London
  const latitude = 51.505;
  const longitude = -0.09;

  const position = [latitude, longitude];

  //const position = userGlobal.location;
  /*
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
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
  });

  const SearchComponent = () => {
    const map = useMapEvents({
      click: () => {
        map.locate();
      },
    });

    return (
      <SearchControl
        provider={new OpenStreetMapProvider()}
        showMarker={false}
        showPopup={false}
        maxMarkers={1}
        retainZoomLevel={false}
        animateZoom={true}
        autoClose={true}
        position="topright"
        keepResult={true}
        inputPlaceholder="Search for a location"
      />
    );
  };

NEL RENDER
  <SearchComponent />

  {userLocation && (
  <Marker 
  position={userLocation} 
   icon={skater}>
    <Popup>Your Location</Popup>
  </Marker>
)}
  */

  return (
    <div className="map__container d-flex flex-row justify-content-center">
      <div className="mt-3" style={{ height: "200px", width: "100%" }}>
        <MapContainer
          //center={userLocation || [0, 0]}
          center={position}
          zoom={2}
          //zoom={userLocation ? 12 : 2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={skater}>
            <Popup>Here you are.</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
