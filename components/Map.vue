<template>
  <div>
    <Dialog :open="isOpen" class="relative z-50" @close="closeModal">
      <!-- backdrop-->
      <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

      <!-- dialog itself-->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="relative p-4 w-full max-w-sm rounded bg-white">
          <button
            type="button"
            class="absolute top-1 right-1 bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            @click="closeModal"
          >
            <Icon name="mdi:close" class="h-6 w-6" aria-hidden="true" />
          </button>
          <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
            Légende
          </DialogTitle>
          <div class="mt-2">
            <div class="grid grid-cols-[64px_1fr] gap-x-4">
              <div class="my-auto">
                <div class="h-1 relative">
                  <div class="absolute h-full w-full">
                    <div class="h-full bg-lvv-blue-600 dashed-line" />
                  </div>
                </div>
              </div>
              <div>prévu pour 2026</div>

              <div class="my-auto">
                <div class="h-1 bg-lvv-blue-600" />
              </div>
              <div>terminé</div>

              <div class="my-auto">
                <div class="h-1 relative">
                  <div class="absolute h-full w-full">
                    <div class="h-full bg-lvv-blue-600 dashed-line animated-dashes" />
                  </div>
                </div>
              </div>
              <div>en travaux</div>

              <div class="my-auto">
                <div class="h-2 bg-lvv-blue-600 opacity-30" />
              </div>
              <div>linéaire inconnu</div>

              <div class="my-auto">
                <div class="text-lvv-blue-600 font-bold">
                  x x x x x
                </div>
              </div>
              <div>abandonné pour 2026</div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
    <div id="map" class="rounded-lg" style="height: 40vh" />
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/vue'
import { ref } from 'vue'
import style from '@/assets/style.json'
import LegendControl from '@/maplibre/LegendControl'

const { geojson } = defineProps({
  geojson: { type: Object, required: true }
})

const { plotDoneSections, plotWipSections, plotPlannedSections, plotVarianteSections, plotUnknownSections, plotAbandonedSections, fitBounds } = useMap()

const isOpen = ref(false)
function closeModal () {
  isOpen.value = false
}
function openModal () {
  isOpen.value = true
}

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
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
  const legendControl = new LegendControl({
    onClick: () => openModal()
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

.dashed-line {
    background-image: linear-gradient(to right, transparent 50%, white 50%);
    background-position: 0 0;
    background-repeat: repeat-x;
    background-size: 12px 0.25rem;
}

.animated-dashes {
    animation: dash-animation 0.5s linear infinite;
}

@keyframes dash-animation {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 12px 0;
    }
}

</style>
