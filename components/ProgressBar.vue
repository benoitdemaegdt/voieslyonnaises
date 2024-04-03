<template>
  <div class="max-w-2xl mx-auto bg-gray-200 rounded-full flex overflow-hidden my-8">
    <div
      class="bg-lvv-blue-600 text-xs font-medium text-white text-center p-1 leading-none"
      :style="`width: ${stats.done.percent}`"
    >
      {{ stats.done.percent }}
    </div>
    <div
      v-if="stats.wip.distance"
      class="bg-lvv-blue-400 text-white text-center"
      :style="`width: ${stats.wip.percent}; background: repeating-linear-gradient(to right, #152B68, #152B68 1px, transparent 1px, transparent 3px)`"
    />
    <div
      v-if="stats.postponed.distance"
      class="bg-lvv-pink text-xs font-medium text-white text-center p-1 leading-none ml-auto"
      :style="`width: ${stats.postponed.percent}`"
    >
      {{ stats.postponed.percent }}
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
