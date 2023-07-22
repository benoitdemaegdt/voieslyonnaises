<template>
  <div>
    <LegendModal ref="legendModalComponent" />
    <div id="map" class="rounded-lg" style="height: 40vh" />
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import style from '@/assets/style.json'
import LegendControl from '@/maplibre/LegendControl'

const { geojson } = defineProps({
  geojson: { type: Object, required: true }
})

const legendModalComponent = ref(null)

const {
  plotDoneSections,
  plotWipSections,
  plotPlannedSections,
  plotVarianteSections,
  plotUnknownSections,
  plotAbandonedSections,
  fitBounds,
  exitFullscreen
} = useMap()

onMounted(() => {
  const map = new maplibregl.Map({
    container: 'map',
    style,
    center: [4.8312188, 45.757198],
    zoom: 13
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
  map.addControl(new maplibregl.FullscreenControl(), 'top-right')
  const legendControl = new LegendControl({
    onClick: () => {
      exitFullscreen()
      return legendModalComponent.value.openModal()
    }
  })
  map.addControl(legendControl, 'top-right')

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

.maplibregl-info {
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: auto;
    background-image: url('~/maplibre/info.svg');
    background-size: 85%;
}
</style>
