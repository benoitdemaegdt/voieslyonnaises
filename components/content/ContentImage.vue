<template>
  <figure class="grid grid-cols-1 justify-items-center">
    <img
      class="w-full rounded-lg"
      :src="imageUrl"
      :alt="caption"
      loading="lazy"
      width="1310"
      height="873"
    >
    <figcaption class="text-center">
      {{ caption }}
    </figcaption>
    <div v-if="credit" class="text-base text-center italic">
      Crédit image : {{ credit }}
    </div>
    <div v-if="streetView">
      <StreetViewLink :params="streetView" />
    </div>
  </figure>
</template>

<script setup>
defineProps({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: false },
  credit: { type: String, required: false },
  streetView: { type: String, required: false }
});
</script>
