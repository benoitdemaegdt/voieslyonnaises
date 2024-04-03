<template>
  <div class="max-w-2xl mx-auto bg-gray-200 rounded-full flex overflow-hidden my-8">
    <div
      class="bg-lvv-blue-600 text-xs font-medium text-white text-center p-1 leading-none"
      :style="`width: ${stats[0].percent}`"
    >
      {{ stats[0].percent }}
    </div>
    <div
      v-if="stats[1].distance"
      class="bg-lvv-blue-400 text-white text-center"
      :style="`width: ${stats[1].percent}; background: repeating-linear-gradient(to right, #152B68, #152B68 1px, transparent 1px, transparent 3px)`"
    />
    <div
      v-if="stats[3].distance"
      class="bg-lvv-pink text-xs font-medium text-white text-center p-1 leading-none ml-auto"
      :style="`width: ${stats[3].percent}`"
    >
      {{ stats[3].percent }}
    </div>
  </div>
</template>

<script setup>
const { getStats } = useStats();

const { voies } = defineProps({
  voies: { type: Array, required: true }
});

const stats = getStats(voies);
</script>
