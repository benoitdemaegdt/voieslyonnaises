<template>
  <div class="my-4 flex justify-center">
    <div class="grid grid-cols-[300px_1fr] gap-x-4 text-lvv-blue-600">
      <div class="text-right pr-4 text-gray-900">
        Typologie
      </div>
      <div />
      <template v-for="stat in stats" :key="stat.name">
        <div class="font-bold text-right pr-4 border-r-2 border-lvv-blue-600">
          {{ stat.name }}
        </div>
        <div class="my-auto flex items-center">
          <div class="h-2 mr-4 bg-lvv-blue-600 rounded-full" :style="`width: ${stat.percent * 3}px`" />
          {{ stat.percent }}%
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const { getStatsByTypology } = useStats();

const { voies } = defineProps({
  voies: { type: Array, required: true }
});

const stats = getStatsByTypology(voies);
</script>
