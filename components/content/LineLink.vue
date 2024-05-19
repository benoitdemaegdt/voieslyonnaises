<template>
  <NuxtLink :to="`${href}`" :style="`color: ${color}; text-decoration-color: ${color};`">
    {{ getRevName('singular') }}
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
const { getRevName } = useConfig();
const { getVoieCyclablePath } = useUrl();

const { line, anchor } = defineProps({
  line: { type: String, required: true },
  anchor: { type: String, default: '' }
});

const color = getLineColor(Number(line));

const href = anchor
  ? `${getVoieCyclablePath(line)}#${anchor}`
  : `${getVoieCyclablePath(line)}`;
</script>
