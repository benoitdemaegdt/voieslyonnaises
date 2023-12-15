<template>
  <div>
    <div class="max-w-2xl mx-auto bg-gray-200 rounded-full">
      <div class="bg-lvv-blue-600 text-xs font-medium text-white text-center p-1 leading-none rounded-full" :style="`width: ${percent}%`">
        {{ percent }}%
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

const totalDistance = getDistance({ features });
const doneDistance = getDistance({ features: doneFeatures });

const percent = Math.round(doneDistance / totalDistance * 100);
</script>
