<template>
  <div>
    <div>
      <div class="text-center text-black">
        Distance totale: <strong>{{ Math.round(voie.distance / 1000) }}km</strong> - Fréquentation max 2030: <strong>{{ voie.trafic }}</strong>
      </div>
      <ProgressBar :voies="[geojson]" />
      <Stats :voies="[geojson]" />
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
</script>
