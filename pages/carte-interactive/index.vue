<template>
  <div class="h-full w-full">
    <div id="map" class="h-full"></div>
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen',
})

const { getGeojsonFeatures } = useGeojson()

const { data: voies } = await useAsyncData(() => {
  return queryContent().find()
})
const sections = voies.value
  .map(voie => getGeojsonFeatures(voie))
  .flat()

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://raw.githubusercontent.com/benoitdemaegdt/voieslyonnaises/main/style.json',
    center: [4.8312188, 45.757198],
    zoom: 13
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  map.addControl(new maplibregl.FullscreenControl(), 'top-right');

  map.on('load', () => {
    map.addSource('done-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.status === 'done')
      }
    })
    map.addLayer({
      id: 'done-sections',
      type: 'line',
      source: 'done-sections',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
      }
    })

    map.addSource('in-progress-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.status === 'in-progress')
      }
    })
    map.addLayer({
      id: 'in-progress-sections',
      type: 'line',
      source: 'in-progress-sections',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
        'line-dasharray': [1, 1],
      }
    })

    map.addSource('not-started-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.status === 'not-started')
      }
    })
    map.addLayer({
      id: 'not-started-sections',
      type: 'line',
      source: 'not-started-sections',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
        'line-dasharray': [2, 2],
      }
    })

    const allCoordinates = sections.map(section => section.geometry.coordinates).flat()
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });

    map.on('click', 'done-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<h1 class="text-sm font-semibold text-gray-800">${e.features[0].properties.name}</h1><p>tronçon terminé et pratiquable</p>`)
        .addTo(map)
    })
    map.on('click', 'in-progress-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<h1 class="text-sm font-semibold text-gray-800">${e.features[0].properties.name}</h1><p>tronçon en travaux 🚧</p>`)
        .addTo(map)
    })
    map.on('click', 'not-started-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(`<h1 class="text-sm font-semibold text-gray-800">${e.features[0].properties.name}</h1><p>tronçon en étude</p>`)
        .addTo(map)
    })

    map.on('mouseenter', 'done-sections', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'done-sections', () => map.getCanvas().style.cursor = '')
    map.on('mouseenter', 'in-progress-sections', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'in-progress-sections', () => map.getCanvas().style.cursor = '')
    map.on('mouseenter', 'not-started-sections', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'not-started-sections', () => map.getCanvas().style.cursor = '')
  })
})
</script>
