<template>
  <div>
    <span v-if="evolution === 0 " class="text-gray-600">
      N/A
    </span>
    <span v-if="evolution > 0 " class="text-green-600">
      <Icon name="mdi:arrow-top-right-thin" />
      +{{ evolution }}%
    </span>
    <span v-if="evolution < 0 " class="text-red-600">
      <Icon name="mdi:arrow-bottom-right-thin" />
      {{ evolution }}%
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
   count1?: number,
   count2?: number
 }>();

const evolution = computed(() => {
  if (props.count1 === undefined || props.count1 === 0) { return 0; }
  if (props.count2 === undefined || props.count2 === 0) { return 0; }
  return Math.round(((props.count2 - props.count1) / props.count1) * 1000) / 10;
});
</script>
