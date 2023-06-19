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

const { plotDoneSections, plotWipSections, plotPlannedSections, plotVarianteSections, plotUnknownSections, plotAbandonedSections, fitBounds } = useMap()

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
    plotDoneSections({ map, features: geojson.features })
    plotPlannedSections({ map, features: geojson.features })
    plotVarianteSections({ map, features: geojson.features })
    plotWipSections({ map, features: geojson.features })
    plotUnknownSections({ map, features: geojson.features })
    plotAbandonedSections({ map, features: geojson.features })

    fitBounds({ map, features: geojson.features })
  })
})
</script>

<style>
.maplibregl-popup-content {
    @apply p-0;
}
</style>
