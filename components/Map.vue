<template>
  <div class="relative">
    <LegendModal ref="legendModalComponent" @update:visible-statuses="refreshVisibleStatuses" />
    <div id="map" class="rounded-lg h-full w-full" />
    <img
      v-if="options.logo"
      class="my-0 absolute bottom-0 right-0 z-10"
      src="https://cyclopolis.lavilleavelo.org/logo-lvv-carte.png"
      width="75"
      height="75"
      alt="logo la ville à vélo"
    >
  </div>
</template>

<script setup>
import { createApp, defineComponent, h, Suspense } from 'vue';
import { Map, AttributionControl, GeolocateControl, NavigationControl, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import style from '@/assets/style.json';
import LegendControl from '@/maplibre/LegendControl';
import FullscreenControl from '@/maplibre/FullscreenControl';
import ShrinkControl from '@/maplibre/ShrinkControl';
import LineTooltip from '~/components/tooltips/LineTooltip.vue';
import CounterTooltip from '~/components/tooltips/CounterTooltip.vue';
import PerspectiveTooltip from '~/components/tooltips/PerspectiveTooltip.vue';

// const config = useRuntimeConfig();
// const maptilerKey = config.public.maptilerKey;

const props = defineProps({
  features: { type: Array, required: true },
  options: {
    type: Object,
    required: false,
    default: () => ({})
  }
});

const defaultOptions = {
  logo: true,
  legend: true,
  geolocation: false,
  fullscreen: false,
  onFullscreenControlClick: () => { },
  shrink: false,
  onShrinkControlClick: () => { }
};

const options = { ...defaultOptions, ...props.options };

const legendModalComponent = ref(null);

const {
  plotFeatures,
  fitBounds
} = useMap();

const visibleStatuses = ref(['planned', 'variante', 'done', 'postponed', 'variante-postponed', 'unknown', 'wip']);
const features = computed(() => {
  return (props.features ?? []).filter(feature => {
    return visibleStatuses.value.includes(feature.properties.status);
  });
});

function refreshVisibleStatuses(newVisibleStatuses) {
  visibleStatuses.value = newVisibleStatuses;
}

onMounted(() => {
  const map = new Map({
    container: 'map',
    style,
    // style: `https://api.maptiler.com/maps/dataviz/style.json?key=${maptilerKey}`,
    center: [4.8312188, 45.757198],
    zoom: 12,
    attributionControl: false
  });
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left');
  map.addControl(new AttributionControl({ compact: false }), 'bottom-left');
  if (options.fullscreen) {
    const fullscreenControl = new FullscreenControl({
      onClick: () => options.onFullscreenControlClick()
    });
    map.addControl(fullscreenControl, 'top-right');
  }
  if (options.geolocation) {
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
      }),
      'top-right'
    );
  }
  if (options.shrink) {
    const shrinkControl = new ShrinkControl({
      onClick: () => options.onShrinkControlClick()
    });
    map.addControl(shrinkControl, 'top-right');
  }
  if (options.legend) {
    const legendControl = new LegendControl({
      onClick: () => legendModalComponent.value.openModal()
    });
    map.addControl(legendControl, 'top-right');
  }

  map.on('load', () => {
    plotFeatures({ map, features: features.value });
    const tailwindMdBreakpoint = 768;
    if (window.innerWidth > tailwindMdBreakpoint) {
      fitBounds({ map, features: features.value });
    }
  });

  watch(
    features,
    newFeatures => {
      plotFeatures({ map, features: newFeatures });
    }
  );

  watch(
    () => props.features,
    newFeatures => {
      plotFeatures({ map, features: newFeatures });
    }
  );

  // must do this to avoid multiple popups
  map.on('click', e => {
    const layers = map
      .queryRenderedFeatures(e.point)
      .filter(({ layer }) => !['maptiler_planet', 'openmaptiles'].includes(layer.source));

    if (layers.length === 0) {
      return;
    }

    const isPerspectiveLayerClicked = layers.some(({ layer }) => layer.id === 'perspectives');
    const isCompteurLayerClicked = layers.some(({ layer }) => layer.id === 'compteurs');

    if (isPerspectiveLayerClicked) {
      const layer = layers.find(({ layer }) => layer.id === 'perspectives');
      const feature = features.value.find(f => {
        return f.properties.type === 'perspective' &&
          f.properties.line === layer.properties.line &&
          f.properties.imgUrl === layer.properties.imgUrl;
      });

      new Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML('<div id="perspective-tooltip-content"></div>')
        .addTo(map);

      const PerspectiveTooltipComponent = defineComponent(PerspectiveTooltip);
      nextTick(() => {
        // eslint-disable-next-line vue/one-component-per-file
        createApp({
          render: () => h(Suspense, null, {
            default: h(PerspectiveTooltipComponent, { feature }),
            fallback: 'Chargement...'
          })
        }).mount('#perspective-tooltip-content');
      });
    } else if (isCompteurLayerClicked) {
      const layer = layers.find(({ layer }) => layer.id === 'compteurs');
      const feature = features.value.find(f => f.properties.name === layer.properties.name);

      new Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML('<div id="counter-tooltip-content"></div>')
        .addTo(map);

      const CounterTooltipComponent = defineComponent(CounterTooltip);
      nextTick(() => {
        // eslint-disable-next-line vue/one-component-per-file
        createApp({
          render: () => h(Suspense, null, {
            default: h(CounterTooltipComponent, { feature }),
            fallback: 'Chargement...'
          })
        }).mount('#counter-tooltip-content');
      });
    } else {
      const { line, name } = layers[0].properties;
      // take care layers[0].geometry is truncated (to fit tile size). We need to find the full feature.
      const feature = features.value
        .filter(feature => feature.geometry.type === 'LineString')
        .find(feature => feature.properties.line === line && feature.properties.name === name);
      const lines = feature.properties.id
        ? [...new Set(layers.filter(f => f.properties.id === feature.properties.id).map(f => f.properties.line))]
        : [feature.properties.line];

      new Popup({ closeButton: false, closeOnClick: true })
        .setLngLat(e.lngLat)
        .setHTML('<div id="line-tooltip-content"></div>')
        .addTo(map);

      const LineTooltipComponent = defineComponent(LineTooltip);
      nextTick(() => {
        // eslint-disable-next-line vue/one-component-per-file
        createApp({
          render: () => h(Suspense, null, {
            default: h(LineTooltipComponent, { feature, lines }),
            fallback: 'Chargement...'
          })
        }).mount('#line-tooltip-content');
      });
    }
  });
});
</script>

<style>
.maplibregl-popup-content {
  @apply p-0 rounded-lg overflow-hidden;
}

.maplibregl-info {
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: auto;
  background-image: url('~/maplibre/info.svg');
  background-size: 85%;
}

.maplibregl-fullscreen {
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: auto;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='%23333'%3E%3Cpath d='M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z'/%3E%3C/svg%3E");
}

.maplibregl-shrink {
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: auto;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29'%3E%3Cpath d='M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z'/%3E%3C/svg%3E");
}

.maplibregl-popup-anchor-top .maplibregl-popup-tip,
.maplibregl-popup-anchor-top-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-top-right .maplibregl-popup-tip {
  border-bottom-color: transparent;
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip {
  border-top-color: transparent;
}

.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: transparent;
}

.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: transparent;
}
</style>
