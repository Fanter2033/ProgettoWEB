import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function RenderMap({ coordinates }) {
  
  if (!Array.isArray(coordinates)) {
    console.log(coordinates);
    console.error("Coordinate non valide.");
    return null;
  }

  const skater = new L.Icon({
    iconUrl: require("./media/icone/geo.png"),
    iconSize: [25, 25],
  });

  /*
  bellino
<TileLayer
        url="https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png"
        attribution='<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>'
      />
      
con il verde
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, <a href="https://www.arcgis.com/home/item.html?id=f1e992cf44764dd3a0a0a1b84d308f6d">ArcGIS Online</a> contributors'
      />



  BELLA
<TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, <a href="https://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f">ArcGIS Online</a> contributors'
      />


  */

  return (
    
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: "200px", width: "100%" }}
    >
      <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

      <Marker position={coordinates} icon={skater} />
    </MapContainer>
  );
}

export default RenderMap;
