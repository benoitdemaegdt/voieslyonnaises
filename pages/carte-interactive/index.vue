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

const { plotDoneSections, plotWipSections, plotPlannedSections, plotVarianteSections, plotUnknownSections, plotAbandonedSections, fitBounds } = useMap()

const { data: voies } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'json' }).find()
})

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
    const features = voies.value.map(voie => voie.features).flat()

    plotDoneSections({ map, features })
    plotPlannedSections({ map, features })
    plotVarianteSections({ map, features })
    plotWipSections({ map, features })
    plotUnknownSections({ map, features })
    plotAbandonedSections({ map, features })

    fitBounds({ map, features })
  })
})

const description = 'Découvrez la carte des voies lyonnaises. Itinéraires rue par rue. Plan régulièrement mis à jour pour une information complète.'
const COVER_IMAGE_URL = 'https://res.cloudinary.com/monpetitsommet/image/upload/v1663494829/voieslyonnaises/voies-lyonnaises_wkew1x.png'
useHead({
  title: 'Carte à jour des voies lyonnaises',
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description },
    // cover image
    { hid: 'og:image', property: 'og:image', content: COVER_IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: COVER_IMAGE_URL }
  ]
})
</script>

<style>
.maplibregl-popup-content {
    @apply p-0;
}
</style>
