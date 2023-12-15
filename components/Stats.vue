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
const { getAllUniqLineStrings, getDistance } = useStats();

const { voies } = defineProps({
  voies: { type: Array, required: true }
});

const features = getAllUniqLineStrings(voies);
const doneFeatures = features.filter(feature => feature.properties.status === 'done');
const wipFeatures = features.filter(feature => feature.properties.status === 'wip');
const plannedFeatures = features.filter(feature => ['planned', 'unknown', 'variante'].includes(feature.properties.status));
const postponedFeatures = features.filter(feature => ['postponed', 'variante-postponed'].includes(feature.properties.status));

const totalDistance = getDistance({ features });
const doneDistance = getDistance({ features: doneFeatures });
const wipDistance = getDistance({ features: wipFeatures });
const plannedDistance = getDistance({ features: plannedFeatures });
const postponedDistance = getDistance({ features: postponedFeatures });

function getPercent(distance) {
  return Math.round(distance / totalDistance * 100);
}

function getDistanceInKm(distance) {
  return Math.round(distance / 1000);
}

const stats = [
  { name: 'Réalisés', distance: `${getDistanceInKm(doneDistance)} km`, percent: `${getPercent(doneDistance)}%` },
  { name: 'En travaux', distance: `${getDistanceInKm(wipDistance)} km`, percent: `${getPercent(wipDistance)}%` },
  { name: 'Prévus', distance: `${getDistanceInKm(plannedDistance)} km`, percent: `${getPercent(plannedDistance)}%` },
  { name: 'Reportés', distance: `${getDistanceInKm(postponedDistance)} km`, percent: `${getPercent(postponedDistance)}%` }
];
</script>
