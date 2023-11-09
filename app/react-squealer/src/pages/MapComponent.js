import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/App.css";
import { Icon } from "leaflet";

const MapComponent = () => {
  const skater = new Icon({
    iconUrl: "./media/icone/plus.svg",
    iconSize: [25, 25],
  });

  //const mapRef = useRef(null);
  const latitude = 51.505;
  const longitude = -0.09;
  const position = [latitude, longitude];

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <div className="map__container d-flex flex-row justify-content-center">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "40vh", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={skater}>
          <Popup>Here you are.</Popup>
        </Marker>
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
