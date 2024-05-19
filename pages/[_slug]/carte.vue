<template>
  <ClientOnly>
    <Map :features="voie.features" :options="mapOptions" class="h-full w-full" />
  </ClientOnly>
</template>

<script setup>
const { path } = useRoute();
const { getVoieCyclableRegex } = useUrl();
const { getRevName } = useConfig();

const regex = getVoieCyclableRegex();
const line = path.match(regex)[1];

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen',
  middleware: 'voie-cyclable'
});

const mapOptions = {
  shrink: true,
  onShrinkControlClick: () => {
    const route = useRoute();
    return navigateTo({ path: `/${route.params._slug}` });
  }
};

const { data: voie } = await useAsyncData(() => {
  return queryContent('voies-cyclables')
    .where({ _type: 'json', _path: `/voies-cyclables/ligne-${line}` })
    .findOne();
});

const description = `Carte de la ${getRevName('singular')} ${line}. Découvrez les tronçons prévus, déjà réalisés, en travaux et ceux reportés après 2026.`;
useHead({
  title: `Carte de la ${getRevName('singular')} ${line}`,
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description }
  ]
});
</script>
