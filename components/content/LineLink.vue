<template>
  <NuxtLink :to="href" :style="`color: ${color}; text-decoration-color: ${color};`">
    {{ getRevName('singular') }}
    <span
      class="h-6 w-6 rounded-full inline-flex items-center justify-center text-white"
      :style="`background-color: ${color};`"
    >
      {{ line }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const { getLineColor } = useColors();
const { getRevName } = useConfig();
const { getVoieCyclablePath } = useUrl();

const { line, anchor } = defineProps<{
  line: string
  anchor?: string
}>();

const color = getLineColor(Number(line));

const href = anchor
  ? `${getVoieCyclablePath(Number(line))}#${anchor}`
  : `${getVoieCyclablePath(Number(line))}`;
</script>
