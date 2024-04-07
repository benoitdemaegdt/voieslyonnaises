<template>
  <NuxtLink :to="`${href}`" :style="`color: ${color}; text-decoration-color: ${color};`">
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

const { line, anchor } = defineProps({
  line: { type: String, required: true },
  anchor: { type: String, default: '' }
});

const color = getLineColor(Number(line));

const href = anchor
  ? `/voie-lyonnaise-${line}#${anchor}`
  : `/voie-lyonnaise-${line}`;
</script>
