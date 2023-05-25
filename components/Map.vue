<template>
  <div id="map" class="rounded-lg" style="height: 40vh" />
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import style from '@/assets/style.json'

const { geojson } = defineProps({
  geojson: { type: Object, required: true }
})

const { getTooltipHtml } = useTooltip()

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style,
    center: [4.8312188, 45.757198],
    zoom: 13,
    attributionControl: false
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
  map.addControl(new maplibregl.FullscreenControl(), 'top-right')
  map.addControl(new maplibregl.AttributionControl({ compact: true }))

  map.on('load', () => {
    map.addSource('done-sections', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: geojson.features.filter(({ properties }) => properties.isDone === true)
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
        features: geojson.features.filter(({ properties }) => properties.isDone === false)
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

    const allCoordinates = geojson.features
      .map(feature => feature.geometry.coordinates)
      .flat()
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

<style>
.maplibregl-popup-content {
    @apply p-0;
}
</style>
