<template>
  <div class="h-full w-full">
    <div id="map" class="h-full" />
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import style from '@/assets/style.json'

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen'
})

const { getTooltipHtml } = useTooltip()

const { data: voies } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'json' }).find()
})

const sections = voies.value
  .map(voie => voie.features)
  .flat()

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style,
    center: [4.8312188, 45.757198],
    zoom: 13
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
  map.addControl(new maplibregl.FullscreenControl(), 'top-right')

  map.on('load', () => {
    map.addSource('done-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.isDone === true)
      }
    })
    map.addLayer({
      id: 'done-sections',
      type: 'line',
      source: 'done-sections',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color']
      }
    })

    map.addSource('not-done-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: sections.filter(({ properties }) => properties.isDone === false)
      }
    })
    map.addLayer({
      id: 'not-done-sections',
      type: 'line',
      source: 'not-done-sections',
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
        'line-dasharray': [1.5, 1.5]
      }
    })

    const allCoordinates = sections.map(section => section.geometry.coordinates).flat()
    const bounds = new maplibregl.LngLatBounds(allCoordinates[0], allCoordinates[0])
    for (const coord of allCoordinates) {
      bounds.extend(coord)
    }
    map.fitBounds(bounds, { padding: 20 })

    map.on('click', 'done-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
        .addTo(map)
    })
    map.on('click', 'not-done-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
        .addTo(map)
    })

    map.on('mouseenter', 'done-sections', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'done-sections', () => map.getCanvas().style.cursor = '')
    map.on('mouseenter', 'not-done-sections', () => map.getCanvas().style.cursor = 'pointer')
    map.on('mouseleave', 'not-done-sections', () => map.getCanvas().style.cursor = '')
  })
})
</script>
