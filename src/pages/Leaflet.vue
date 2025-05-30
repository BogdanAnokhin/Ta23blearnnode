<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Координаты дома (Orumetsa 1, Maardu)
const homeCoords = [59.479235, 25.0153339];
const coords = ref([...homeCoords]);
const zoom = ref(16);

let map = null;
let homeMarker = null;
let homeOutline = null;

function goHome() {
  coords.value = [...homeCoords];
  zoom.value = 16;
  if (map) {
    map.setView(homeCoords, zoom.value);
    if (homeMarker) homeMarker.setLatLng(homeCoords);
  }
}

onMounted(async () => {
  await nextTick(); // Ждём пока DOM будет готов

  map = L.map('map').setView(coords.value, zoom.value);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const homeIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/69/69524.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  homeMarker = L.marker(homeCoords, { icon: homeIcon }).addTo(map);

  // 🔴 Прямоугольная обводка дома (координаты из скриншота)
  const outlineCoords = [
    [59.479285, 25.015190],
    [59.479285, 25.015470],
    [59.479175, 25.015470],
    [59.479175, 25.015190]
  ];

  homeOutline = L.polygon(outlineCoords, {
    color: 'red',
    weight: 2,
    fillOpacity: 0.1
  }).addTo(map);
});

watch(zoom, (newZoom) => {
  if (map) {
    map.setZoom(newZoom);
  }
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px; max-width: 400px; margin-bottom: 10px;">
    <button class="button is-success" @click="goHome">🏠 Kodu</button>
    <input type="range" min="1" max="19" step="1" v-model="zoom" />
  </div>

  <div id="map" style="height: 400px;"></div>
</template>
