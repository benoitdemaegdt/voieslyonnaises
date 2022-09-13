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

onMounted(() => {
  const map = new mapboxgl.Map({
    accessToken: config.public.mapboxAccessToken,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [4.8312188, 45.757198],
    zoom: 13
  })

  map.on('load', () => {
    map.addSource('lines', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: voies.value
          .map(voie => getGeojsonFeatures(voie))
          .flat()
      }
    })

    map.addLayer({
      id: 'lines',
      type: 'line',
      source: 'lines',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color']
      }
    })
  })
})
</script>
