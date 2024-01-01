<template>
  <div class="h-full w-full flex flex-col">
    <ClientOnly>
      <Map :features="features" class="h-full w-full" />
    </ClientOnly>
    <div class="py-5 px-5 md:px-8">
      <div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen'
});

const years = ref([
  { label: '< 2020', match: (year) => year < 2020, isChecked: true },
  { label: '2020', match: (year) => year === 2020, isChecked: false },
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

// const years = ['2020', '2021', '2022', '2023', '2024'];
//
// const selectedYear = ref('2023');
//
// const updateValue = (event) => {
//   selectedYear.value = event.target.value;
//   // set color of range slider
//   event.target.style.setProperty('--cursor-position', `${(event.target.value - event.target.min) / (event.target.max - event.target.min) * 100}%`);
// };
//
// onMounted(() => {
//   const slider = document.querySelector('.range-slider');
//   slider.style.setProperty('--cursor-position', `${(slider.value - slider.min) / (slider.max - slider.min) * 100}%`);
// });
//
// const { data: voies } = await useAsyncData(() => {
//   return queryContent('voies-lyonnaises').where({ _type: 'json' }).find();
// });
//
// const features = computed(() => {
//   return voies.value.map(voie => voie.features)
//     .flat()
//     .filter(feature => feature.properties.status === 'done')
//     .filter(feature => {
//       if (!feature.properties.doneAt) { return false; }
//       const [day, month, year] = feature.properties.doneAt.split('/');
//       return new Date(Number(year), Number(month) - 1, Number(day)).getTime() <= new Date(Number(selectedYear.value), 0, 1).getTime();
//     });
// });
</script>

<!--<style>-->
<!--.range-slider {-->
<!--  -webkit-appearance: none;-->
<!--  background: linear-gradient(to right, #152B68 0%, #152B68 var(&#45;&#45;cursor-position), #DEDBDD var(&#45;&#45;cursor-position), #DEDBDD 100%);-->
<!--  @apply w-full h-2.5 outline-none transition-opacity duration-200 rounded-lg;-->
<!--}-->

<!--.range-slider::-webkit-slider-thumb {-->
<!--  -webkit-appearance: none;-->
<!--  @apply bg-lvv-blue-600 h-6 w-6 rounded-full cursor-pointer appearance-none;-->
<!--}-->

<!--.range-slider::-moz-range-thumb {-->
<!--  @apply bg-lvv-blue-600 h-6 w-6 rounded-full cursor-pointer;-->
<!--}-->
<!--</style>-->
