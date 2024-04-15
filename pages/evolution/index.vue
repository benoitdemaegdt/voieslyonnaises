<template>
  <div class="h-full w-full flex flex-col">
    <ClientOnly>
      <Map :features="features" :options="{ logo: false }" class="flex-1" />
    </ClientOnly>
    <div>
      <div class="py-2 px-5 md:px-8 text-white bg-lvv-blue-600 font-semibold text-base">
        {{ doneDistance }} km de Voies Lyonnaises réalisés
      </div>
      <div class="py-5 px-5 md:px-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
        <div
          v-for="year in years"
          :key="year.label"
          @click="year.isChecked = !year.isChecked"
        >
          <div
            class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none"
            :class="{
              'bg-lvv-blue-600 border-transparent text-white hover:bg-lvv-blue-500': year.isChecked,
              'bg-white border-gray-200 text-gray-900 hover:bg-gray-50': !year.isChecked
            }"
          >
            <div>{{ year.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getAllUniqLineStrings, getDistance } = useStats();
// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen'
});

const years = ref([
  { label: '< 2021', match: (year) => year < 2021, isChecked: true },
  { label: '2021', match: (year) => year === 2021, isChecked: false },
  { label: '2022', match: (year) => year === 2022, isChecked: false },
  { label: '2023', match: (year) => year === 2023, isChecked: false },
  { label: '2024', match: (year) => year === 2024, isChecked: false }
]);

const { data: voies } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'json' }).find();
});

const features = computed(() => {
  return voies.value.map(voie => voie.features)
    .flat()
    .filter(feature => feature.properties.status === 'done')
    .filter(feature => {
      if (!feature.properties.doneAt) { return false; }
      const selectedYear = years.value.filter(year => year.isChecked);
      const [,, featureYear] = feature.properties.doneAt.split('/');
      return selectedYear.some(year => year.match(Number(featureYear)));
    });
});

const doneDistance = computed(() => {
  const allUniqFeatures = getAllUniqLineStrings([{ type: 'FeatureCollection', features: features.value }]);
  const doneDistance = getDistance({ features: allUniqFeatures });
  return Math.round(doneDistance / 100) / 10;
});
</script>
