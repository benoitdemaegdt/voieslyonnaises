<template>
  <div id="map" class="rounded-lg" style="height: 40vh"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'

const { voie } = defineProps({
  voie: { type: Object, required: true },
})

const { getGeojsonFeatures } = useGeojson()
const sections = getGeojsonFeatures(voie).flat()

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://raw.githubusercontent.com/benoitdemaegdt/voieslyonnaises/main/style.json',
    center: [4.8312188, 45.757198],
    zoom: 13,
    attributionControl: false
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  map.addControl(new maplibregl.FullscreenControl(), 'top-right');
  map.addControl(new maplibregl.AttributionControl({ compact: true }));

  map.on('load', () => {
    map.addSource('done-lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.status === 'done')
      }
    })
    map.addLayer({
      id: 'done-lines',
      type: 'line',
      source: 'done-lines',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
      }
    })

    map.addSource('in-progress-lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.status === 'in-progress')
      }
    })
    map.addLayer({
      id: 'in-progress-lines',
      type: 'line',
      source: 'in-progress-lines',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
        'line-dasharray': [1, 1],
      }
    })

    const allCoordinates = sections
      .filter(({ properties }) => ['in-progress', 'done'].includes(properties.status))
      .map(section => section.geometry.coordinates)
      .flat()
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });

    map.on('click', 'done-lines', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<h1 class="text-sm font-semibold text-gray-800">${e.features[0].properties.name}</h1><p>tronçon terminé et pratiquable</p>`)
        .addTo(map)
    })
    map.on('click', 'in-progress-lines', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<h1 class="text-sm font-semibold text-gray-800">${e.features[0].properties.name}</h1><p>tronçon en travaux 🚧</p>`)
        .addTo(map)
    })

    map.on('mouseenter', 'done-lines', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'done-lines', () => map.getCanvas().style.cursor = '')
    map.on('mouseenter', 'in-progress-lines', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'in-progress-lines', () => map.getCanvas().style.cursor = '')
  })
})
</script>
