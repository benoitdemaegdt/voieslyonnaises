<template>
  <div>
    <div>
      <div class="text-center text-gray-900">
        Distance totale: <span class="font-bold" :style="`color: ${color}`">{{ displayDistanceInKm(distance, 1) }}</span>
      </div>
      <div class="text-center text-base text-gray-900">
        Fréquentation max 2030: <span class="font-bold" :style="`color: ${color}`">{{ voie.trafic }}</span>
      </div>
      <ProgressBar :voies="[geojson]" />
      <Stats :voies="[geojson]" :precision="1" />
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

const { voie } = defineProps({ voie: Object });

const mapOptions = {
  fullscreen: true,
  onFullscreenControlClick: () => {
    const route = useRoute();
    return navigateTo({ path: `${route.params._slug}/carte` });
  }
};

const { data: geojson } = await useAsyncData(`geojson-${path}`, () => {
  return queryContent('voies-lyonnaises')
    .where({ _type: 'json', _path: voie._path })
    .findOne();
});

const features = geojson.value.features;

const color = getLineColor(Number(voie.line));
const distance = getTotalDistance([geojson.value]);
</script>
