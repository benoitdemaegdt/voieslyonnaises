<template>
  <ClientOnly>
    <Map :features="features" :options="{ geolocation: true }" class="h-full w-full" />
  </ClientOnly>
</template>

<script setup>
// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen'
});

const { data: services } = await useAsyncData(() => {
  return queryContent('services').where({ _type: 'json' }).findOne();
});

const features = services.value.features;
</script>
