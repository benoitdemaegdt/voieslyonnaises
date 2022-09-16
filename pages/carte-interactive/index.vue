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
    style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
    center: [4.8312188, 45.757198],
    zoom: 13
  })

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

    map.on('click', 'done-lines', (e) => {
      new maplibregl.Popup({ closeButton: true, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML('<h1>test</h1>')
        .addTo(map)
    })
    map.on('click', 'in-progress-lines', (e) => {
      new maplibregl.Popup({ closeButton: true, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML('<h1>test</h1>')
        .addTo(map)
    })

    map.on('mouseenter', 'done-lines', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'done-lines', () => map.getCanvas().style.cursor = '')
    map.on('mouseenter', 'in-progress-lines', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'in-progress-lines', () => map.getCanvas().style.cursor = '')
  })
})
</script>
