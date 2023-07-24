<template>
  <div>
    <LegendModal ref="legendModalComponent" />
    <div id="map" class="rounded-lg h-full w-full" />
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import style from '@/assets/style.json'
import LegendControl from '@/maplibre/LegendControl'

const { features } = defineProps({
  features: { type: Array, required: true }
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
    zoom: 12,
    attributionControl: false
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
  map.addControl(new maplibregl.FullscreenControl(), 'top-right')
  map.addControl(new maplibregl.AttributionControl(), 'bottom-left')
  const legendControl = new LegendControl({
    onClick: () => {
      exitFullscreen()
      return legendModalComponent.value.openModal()
    }
  })
  map.addControl(legendControl, 'top-right')

  map.on('load', () => {
    plotDoneSections({ map, features })
    plotPlannedSections({ map, features })
    plotVarianteSections({ map, features })
    plotWipSections({ map, features })
    plotUnknownSections({ map, features })
    plotAbandonedSections({ map, features })

    fitBounds({ map, features })
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
