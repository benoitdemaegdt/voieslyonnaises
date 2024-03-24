<template>
  <div class="not-prose flex items-center justify-center" :style="`background-color: ${color}`">
    <div class="p-1 text-white text-lg font-black">
      Voie Lyonnaise
      <span
        class="h-6 w-6 text-sm rounded-full inline-flex items-center justify-center border-2 border-white"
      >
        {{ feature.properties.line }}
      </span>
    </div>
  </div>
  <img :src="feature.properties.imgUrl" class="my-0">
  <div v-if="feature.properties.name" class="p-1 bg-zinc-100 text-gray-900 text-sm font-medium italic text-center">
    {{ feature.properties.name }}
  </div>
</template>

<script setup lang="ts">
const { getLineColor } = useColors();

const { feature } = defineProps<{
  feature: {
    type: 'Feature';
    properties: {
      type: 'perspective';
      name?: string;
      line: string;
      imgUrl: string;
    };
    geometry: {
      type: 'Point';
      coordinates: [number, number];
    };
  }

}>();

const color = getLineColor(Number(feature.properties.line));
</script>
