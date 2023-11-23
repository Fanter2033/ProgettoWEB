import React from "react";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import { useUserContext } from "../config/UserContext";

import { SearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet/dist/leaflet.css";
import "../css/App.css";


const SearchMap = () => {
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
}

export default SearchMap;

