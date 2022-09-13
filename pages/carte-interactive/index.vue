<template>
  <div class="h-screen w-full">
    <div id="map" class="h-screen"></div>
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const config = useRuntimeConfig()

// https://github.com/nuxt/framework/issues/3587
definePageMeta({ pageTransition: false })

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
        features: [
          {
            type: 'Feature',
            properties: {
              color: '#60A75B'
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [ 4.841043949127197, 45.76011318261302 ],
                [ 4.841322898864746, 45.76283770080708 ],
                [ 4.841451644897461, 45.76460407557531 ],
                [ 4.84147310256958, 45.765606992288184 ],
                [ 4.841365814208984, 45.76705894423796 ],
                [ 4.8410868644714355, 45.76869047401515 ],
                [ 4.840936660766602, 45.769857961443535 ],
                [ 4.84097957611084, 45.77069614247578 ]
              ]
            }
          }
        ]
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
