<template>
  <ClientOnly>
    <Map :features="features" :options="{ filter: false, legend: false, geolocation: true, fullscreen: false }" class="h-full w-full" />
  </ClientOnly>
</template>

<script setup>
// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen'
});

const { data: services } = await useAsyncData(() => {
  return queryContent('services').where({ _type: 'json' }).find();
});

const features = services.value.map(service => service.features).flat();
</script>
