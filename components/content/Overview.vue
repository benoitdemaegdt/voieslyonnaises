<template>
  <div>
    <div>
      <div class="text-center text-xl text-gray-900">
        Distance totale: <span class="font-bold" :style="`color: ${color}`">{{ displayDistanceInKm(distance, 1) }}</span>
      </div>
      <div v-if="voie.trafic" class="text-center text-sm text-gray-900">
        Fréquentation max 2030: <span class="font-bold" :style="`color: ${color}`">{{ voie.trafic }}</span>
      </div>
      <ProgressBar :voies="[geojson]" />
      <Stats :voies="[geojson]" :precision="1" />
      <StatsQuality v-if="displayQuality()" :voies="[geojson]" :precision="1" />
      <Typology :voies="[geojson]" />
    </div>
    <section aria-labelledby="shipping-heading" class="mt-10">
      <ClientOnly>
        <Map :features="features" :options="mapOptions" style="height: 40vh" />
      </ClientOnly>
    </section>
  </div>
</template>

<script setup>
const { path } = useRoute();
const { getLineColor } = useColors();
const { getTotalDistance, displayDistanceInKm } = useStats();
const { displayQuality } = useConfig();

const { voie } = defineProps({ voie: Object });

const mapOptions = {
  fullscreen: true,
  onFullscreenControlClick: () => {
    const route = useRoute();
    return navigateTo({ path: `${route.params._slug}/carte` });
  }
};

const { data: geojson } = await useAsyncData(`geojson-${path}`, () => {
  return queryContent('voies-cyclables')
    .where({ _type: 'json', _path: voie._path })
    .findOne();
});

const features = geojson.value.features;

const color = getLineColor(Number(voie.line));
const distance = getTotalDistance([geojson.value]);
</script>
