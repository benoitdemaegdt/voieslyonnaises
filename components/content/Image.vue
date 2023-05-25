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
    <figcaption>{{ caption }}</figcaption>
  </figure>
</template>

<script setup>
defineProps({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: false }
})
</script>
