<template>
  <span class="font-semibold">{{ type }} {{ line }}</span>
  <span
    class="h-6 w-6 pl-1 ml-1 mr-1 rounded-tl-lg rounded-bl-lg inline-flex items-center justify-center text-white font-bold"
    :style="'background-color: #EF1C24;'">
    {{ type[0].toUpperCase() }}
  </span>
  <span
    class="h-6 w-6 inline-flex items-center justify-center text-white font-bold"
    :style="`background-color: ${color};`">
    {{ line }}
  </span>
</template>

<script setup>
const { getTransportColor } = useColors();

const { type, line } = defineProps({
  type: { type: String, required: true },
  line: { type: String, required: true }
});

const color = getTransportColor(type, line);
</script>