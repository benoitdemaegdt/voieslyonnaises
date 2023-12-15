<template>
  <NuxtLink :to="`/voie-lyonnaise-${line}`" :style="`color: ${color}; text-decoration-color: ${color};`">
    Voie Lyonnaise
    <span
      class="h-6 w-6 rounded-full inline-flex items-center justify-center text-white"
      :style="`background-color: ${color};`"
    >
      {{ line }}
    </span>
  </NuxtLink>
</template>

<script setup>
const { getLineColor } = useColors();

const props = defineProps({
  line: { type: String, required: true }
});

const color = getLineColor(Number(props.line));
</script>
