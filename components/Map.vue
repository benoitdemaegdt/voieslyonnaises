<template>
  <div id="map" class="rounded-lg" style="height: 40vh" />
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import style from '@/assets/style.json'

const { voie } = defineProps({
  voie: { type: Object, required: true }
})

const { getGeojsonFeatures } = useGeojson()
const { getTooltipHtml } = useTooltip()

const sections = getGeojsonFeatures(voie).flat()

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
        features: sections.filter(({ properties }) => properties.status === 'done')
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
        'line-dasharray': [1, 1]
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
        'line-dasharray': [1.5, 1.5]
      }
    })

    const allCoordinates = sections
      .map(section => section.geometry.coordinates)
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
    map.on('click', 'in-progress-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
        .addTo(map)
    })
    map.on('click', 'not-started-sections', (e) => {
      new maplibregl.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML(getTooltipHtml(e.features[0].properties))
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
