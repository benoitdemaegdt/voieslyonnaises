<template>
  <div class="h-10 flex items-center not-prose text-black" :style="`background-color: ${color}`">
    <div class="p-2">
      <a class="text-white font-bold text-lg hover:underline" :href="href">
        Voie Lyonnaise {{ feature.properties.line }}
      </a>
    </div>
  </div>
  <img :src="feature.properties.imgUrl" class="my-0">
</template>

<script setup lang="ts">
const { getLineColor } = useColors();

const { feature } = defineProps<{
  feature: {
    type: 'Feature';
    properties: {
      'type': 'perspective';
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
const href = `/voie-lyonnaise-${feature.properties.line}`;
</script>
