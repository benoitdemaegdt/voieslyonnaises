<template>
  <div class="h-screen w-full">
    <div id="map" class="h-screen"></div>
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// https://github.com/nuxt/framework/issues/3587
definePageMeta({ pageTransition: false })

const config = useRuntimeConfig()
const { getGeojsonFeatures } = useGeojson()

const { data: voies } = await useAsyncData(() => {
  return queryContent().find()
})
const sections = voies.value
  .map(voie => getGeojsonFeatures(voie))
  .flat()


onMounted(() => {
  const map = new mapboxgl.Map({
    accessToken: config.public.mapboxAccessToken,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
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

    map.on('click', ['done-lines', 'in-progress-lines'], (e) => {
      new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.name)
      .addTo(map)
    })

    map.on('mouseenter', ['done-lines', 'in-progress-lines'], () => {
      map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', ['done-lines', 'in-progress-lines'], () => {
      map.getCanvas().style.cursor = ''
    })
  })
})
</script>
