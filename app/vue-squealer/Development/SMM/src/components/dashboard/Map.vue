<template>
  <div id="map" ></div>
</template>

<script>
import L from "leaflet";
import {store} from "@/store";
import "leaflet/dist/leaflet.css";

const iconOptions = {
  iconUrl: "/media/MapMarker.png",
  iconSize: [50, 50],
  shadowSize: [25, 75],
};

export default {
  name: "Map",
  data() {
    return {
      currentMaker: null,
      Coordinates: null,
    };
  },
  methods: {
    initMap() {
      let currentMarker = null;
      const map = L.map("map", {
        center: L.latLng(44.494887, 11.3426163),
        zoom: 14,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      let customIcon = L.icon(iconOptions);
      let markerOptions = {
        icon: customIcon,
        draggable: true,
      };

      let geoScript = document.createElement("script");
      geoScript.setAttribute(
          "src",
          "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js",
      );
      geoScript.onload = () => {
        L.Control.geocoder({
          defaultMarkGeocode: false,
        })
            .on("markgeocode", function (e) {
              let marker = L.marker(e.geocode.center, {icon: customIcon}).addTo(
                  map,
              );
              map.fitBounds(L.latLngBounds([marker.getLatLng()]));
              store.commit('setSInCoor', [marker.getLatLng().lat, marker.getLatLng().lng])
            })
            .addTo(map);
      };
      document.head.appendChild(geoScript);

      map.on("click", function (e) {
        if (currentMarker !== null) map.removeLayer(currentMarker);
        currentMarker = new L.Marker(
            [e.latlng.lat, e.latlng.lng],
            markerOptions,
        ).addTo(map);
        store.commit('setSInCoor', [e.latlng.lat, e.latlng.lng]);
      });
    },
  },
  mounted() {
    let geoLink = document.createElement("link");
    geoLink.setAttribute(
        "href",
        "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css",
    );
    geoLink.setAttribute("rel", "stylesheet");
    document.head.appendChild(geoLink);

    this.initMap();
  },
};
</script>

<style>
@import "leaflet/dist/leaflet.css";

#map {
  height: 300px;
  width: 100%;
}
</style>