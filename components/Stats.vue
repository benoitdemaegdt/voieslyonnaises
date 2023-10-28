<template>
  <div class="grid grid-cols-2 rounded-lg overflow-hidden shadow bg-gray-200 gap-px md:grid-cols-4 ">
    <div v-for="item in stats" :key="item.name" class="px-4 py-5 sm:p-6 bg-white">
      <div class="flex justify-between">
        <div class="text-base font-normal text-gray-900">
          {{ item.name }}
        </div>
        <div class="text-sm font-semibold text-lvv-blue-600">
          {{ item.percent }}
        </div>
      </div>
      <div class="mt-1 flex justify-between items-baseline md:block lg:flex">
        <div class="flex items-baseline text-2xl font-semibold text-lvv-blue-600">
          {{ item.distance }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getAllUniqFeatures, getDistance } = useStats();

const { voies } = defineProps({
  voies: { type: Array, required: true }
});

const features = getAllUniqFeatures(voies);

const total = getDistance({ features, status: ['done', 'wip', 'planned', 'postponed', 'unknown', 'variante', 'variante-postponed'] }).distanceInKilometers;
const done = {
  distance: getDistance({ features, status: ['done'] }).distanceInKilometers,
  percent: Math.round(getDistance({ features, status: ['done'] }).distanceInKilometers / total * 100)
};
const wip = {
  distance: getDistance({ features, status: ['wip'] }).distanceInKilometers,
  percent: Math.round(getDistance({ features, status: ['wip'] }).distanceInKilometers / total * 100)
};
const planned = {
  distance: getDistance({ features, status: ['planned', 'unknown', 'variante'] }).distanceInKilometers,
  percent: Math.round(getDistance({ features, status: ['planned', 'unknown', 'variante'] }).distanceInKilometers / total * 100)
};
const postponed = {
  distance: getDistance({ features, status: ['postponed', 'variante-postponed'] }).distanceInKilometers,
  percent: Math.round(getDistance({ features, status: ['postponed', 'variante-postponed'] }).distanceInKilometers / total * 100)
};

const stats = [
  { name: 'Réalisés', distance: `${done.distance} km`, percent: `${done.percent}%` },
  { name: 'En travaux', distance: `${wip.distance} km`, percent: `${wip.percent}%` },
  { name: 'Prévus', distance: `${planned.distance} km`, percent: `${planned.percent}%` },
  { name: 'Reportés', distance: `${postponed.distance} km`, percent: `${postponed.percent}%` }
];
</script>
