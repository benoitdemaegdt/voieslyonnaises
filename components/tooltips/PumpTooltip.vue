<template>
  <div class="bg-lvv-blue-600 text-white p-2 font-semibold">
    {{ feature.properties.name }}
  </div>
</template>

<script setup lang="ts">
import type { PumpFeature } from '~/types';

const { feature } = defineProps<{
  feature: PumpFeature
}>();

</script>
