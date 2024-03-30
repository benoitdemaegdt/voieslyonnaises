<template>
  <div>
    <div>
      <h3 class="text-center">
        Voie Lyonnaise
        <span
          class="h-8 w-8 rounded-full inline-flex items-center justify-center text-white"
          :style="`background-color: ${voie.color};`"
        >
          {{ voie.line }}
        </span>
      </h3>
      <div class="text-center text-black">
        Distance totale: <strong>{{ Math.round(voie.distance / 1000) }}km</strong> - Fréquentation: <strong>{{ voie.trafic }}</strong>
      </div>
      <div class="my-8 h-8 flex rounded-full overflow-hidden">
        <div class="bg-lvv-blue-600 text-white text-center" :style="`width: ${distancesByStatus['done']?.percentage ?? 0}%`">
          {{ distancesByStatus['done']?.percentage ?? 0 }}%
        </div>
        <div class="bg-lvv-blue-400 text-white text-center" :style="`width: ${distancesByStatus['wip']?.percentage ?? 0}%`">
          {{ distancesByStatus['wip']?.percentage ?? 0 }}%
        </div>
        <div class="text-white text-center flex-grow bg-lvv-blue-100">
        </div>
        <div class="bg-lvv-pink text-white text-center justify-self-end" :style="`width: ${distancesByStatus['postponed']?.percentage ?? 0}%`">
          {{ distancesByStatus['postponed']?.percentage ?? 0 }}%
        </div>
      </div>
      <div class="space-y-6">
        <dl
          class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-4 md:divide-y-0 md:divide-x">
          <div class="px-4 py-5 sm:p-6">
            <dt class="mt-0 flex justify-between text-base font-normal text-gray-900">
              <div>Réalisé</div>
              <div class="text-lvv-blue-600 font-bold">
                {{ distancesByStatus['done']?.percentage ?? 0 }}%
              </div>
            </dt>
            <dd class="mt-1 pl-0 flex justify-between items-baseline md:block lg:flex">
              <div class="flex items-baseline text-2xl font-bold text-lvv-blue-600">
                {{ distancesByStatus['done']?.distance ?? 0 }}km
              </div>
            </dd>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <dt class="mt-0 flex justify-between text-base font-normal text-gray-900">
              <div>En travaux</div>
              <div class="text-lvv-blue-600">
                {{ distancesByStatus['wip']?.percentage ?? 0 }}%
              </div>
            </dt>
            <dd class="mt-1 pl-0 flex justify-between items-baseline md:block lg:flex">
              <div class="flex items-baseline text-2xl text-lvv-blue-600">
                {{ distancesByStatus['wip']?.distance ?? 0 }}km
              </div>
            </dd>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <dt class="mt-0 flex justify-between text-base font-normal text-gray-900">
              <div>Prévu</div>
              <div class="text-black font-semibold">
                {{ distancesByStatus['planned']?.percentage ?? 0 }}%
              </div>
            </dt>
            <dd class="mt-1 pl-0 flex justify-between items-baseline md:block lg:flex">
              <div class="flex items-baseline text-2xl font-semibold text-black">
                {{ distancesByStatus['planned']?.distance ?? 0 }}km
              </div>
            </dd>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <dt class="mt-0 flex justify-between text-base font-normal text-gray-900">
              <div>Reporté</div>
              <div class="text-lvv-pink font-semibold">
                {{ distancesByStatus['postponed']?.percentage ?? 0 }}%
              </div>
            </dt>
            <dd class="mt-1 pl-0 flex justify-between items-baseline md:block lg:flex">
              <div class="flex items-baseline text-2xl font-semibold text-lvv-pink">
                {{ distancesByStatus['postponed']?.distance ?? 0 }}km
              </div>
            </dd>
          </div>
        </dl>
      </div>
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
const { getDistance } = useStats();

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
const featuresByStatus = Object.groupBy(features, (feature => feature.properties.status));
const distancesByStatus = Object.entries(featuresByStatus).reduce((acc, [status, features]) => {
  if (!status) {
    return acc;
  }
  if (!features.every(feature => feature.geometry.type === 'LineString')) {
    return acc;
  }

  const distance = getDistance({ features });
  acc[status] = {
    distance: Math.round(distance / 1000),
    percentage: Math.round(distance / voie.distance * 100)
  };
  return acc;
}, {});
</script>
