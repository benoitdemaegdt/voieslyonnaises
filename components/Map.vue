<template>
  <div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-10" @close="closeModal">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  Légende
                </DialogTitle>
                <div class="mt-2">
                  <div class="flex items-center gap-x-6">
                    <div class="w-16">
                      <div class="relative">
                        <div class="h-1" />
                        <div class="dashed-line-static" />
                      </div>
                    </div>
                    <div>tronçon prévu d'ici 2026</div>
                  </div>

                  <div class="flex items-center gap-x-6">
                    <div class="w-16">
                      <div class="h-1 bg-black" />
                    </div>
                    <div>tronçon terminé</div>
                  </div>

                  <div class="flex items-center gap-x-6">
                    <div class="w-16">
                      <div class="relative">
                        <div class="h-1" />
                        <div class="absolute inset-0">
                          <div class="dashed-line" />
                        </div>
                      </div>
                    </div>
                    <div>tronçon en travaux</div>
                  </div>

                  <div class="flex items-center gap-x-6">
                    <div class="w-16">
                      <div class="text-black font-extrabold">
                        x x x x x
                      </div>
                    </div>
                    <div>tronçon abandonné</div>
                  </div>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-lvv-blue-600 hover:shadow-lg px-4 py-2 text-sm font-medium shadow-sm text-lvv-blue-600 transition duration-300 transform hover:scale-105"
                    @click="closeModal"
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div id="map" class="rounded-lg" style="height: 40vh" />
  </div>
</template>

<script setup>
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
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

.dashed-line::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-image: linear-gradient(to right, transparent 50%, currentColor 50%);
    background-size: 20px 1px;
    background-position: 0 0;
    animation: dashed-line 1.5s linear infinite;
}

.dashed-line-static::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-image: linear-gradient(to right, transparent 50%, currentColor 50%);
    background-size: 20px 1px;
    background-position: 0 0;
}

@keyframes dashed-line {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 100% 0;
    }
}
</style>
