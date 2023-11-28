<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconOptions = {
  iconUrl: '/media/MapMarker.png',
  iconSize: [50, 50],
  shadowSize: [25, 75]
}

export default {
  name: 'Map',
  data() {
    return {
      currentMaker: null
    }
  },
  methods: {
    initMap() {
      let currentMarker = null;
      const map = L.map('map', {
        center: L.latLng(44.494887, 11.3426163),
        zoom: 14,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);

      let customIcon = L.icon(iconOptions);
      let markerOptions = {
        icon: customIcon,
        draggable: true,
      }
      map.on('click', function (e) {
        if (currentMarker !== null)
          map.removeLayer(currentMarker);
        currentMarker = new L.Marker([e.latlng.lat, e.latlng.lng], markerOptions).addTo(map);
        console.log([e.latlng.lat, e.latlng.lng]);
      })
    }
  },
  mounted() {
    this.initMap();
  }
}
</script>

<style>
@import "leaflet/dist/leaflet.css";

#map {
  height: 300px;
  width: 100%;
}
</style>