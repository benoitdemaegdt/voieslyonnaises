<template>
  <div id="map" class="rounded-lg" style="height: 40vh"></div>
</template>

<script setup>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'

// https://github.com/nuxt/framework/issues/3587
definePageMeta({ pageTransition: false })

const { getGeojsonFeatures } = useGeojson()

const { data: voie } = await useAsyncData(() => {
  return queryContent('ligne-1').findOne()
})
const sections = getGeojsonFeatures(voie.value).flat()

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

    const allCoordinates = sections.map(section => section.geometry.coordinates).flat()
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0]);
    for (const coord of allCoordinates) {
      bounds.extend(coord);
    }
    map.fitBounds(bounds, { padding: 20 });

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
