<template>
  <div v-if="stat.nbZone > 0" class="my-5 not-prose p-4 bg-[#F9FAFB]">
    <div class="flex justify-between">
      <div class="text-base font-normal text-gray-900">
        <span class="italic">Au total, </span>
        <span class="text-lvv-pink font-bold">{{ displayDistanceInKm(stat.distance, precision) }}</span> ({{ displayPercent(stat.percent) }})
        <span class="italic">{{ stat.distance < (2 * 1000) ? 'est non satisfaisant' : 'sont non satisfaisants' }}</span>
      </div>
      <div class="text-base font-normal text-gray-900">
        <span class="text-lvv-pink font-bold">{{ stat.nbZone }}</span>
        <span class="italic">{{ stat.nbZone <= 1 ? ' zone problématique subsiste' : ' zones problématiques subsistent' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Geojson } from '~/types';
const { getStatsQuality, displayDistanceInKm, displayPercent } = useStats();

const { voies, precision } = defineProps<{
  voies: Geojson[];
  precision?: number;
}>();

const stat = getStatsQuality(voies);

</script>
