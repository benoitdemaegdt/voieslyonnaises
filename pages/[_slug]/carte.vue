<template>
  <ClientOnly>
    <Map :features="features" :options="mapOptions" class="h-full w-full" />
  </ClientOnly>
</template>

<script setup>
const { path } = useRoute();

const regex = /voie-lyonnaise-(1[0-2]|[1-9])\b/;
const line = path.match(regex)[1];

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen',
  middleware: 'voie-lyonnaise'
});

const mapOptions = {
  shrink: true,
  onShrinkControlClick: () => {
    const route = useRoute();
    return navigateTo({ path: `/${route.params._slug}` });
  }
};

const { data: voie } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises')
    .where({ _type: 'json', _path: `/voies-lyonnaises/ligne-${line}` })
    .findOne();
});

const features = voie.value.features.map((feature, index) => ({
  id: index,
  ...feature
}));

const description = `Carte de la Voie Lyonnaise ${line}. Découvrez les tronçons prévus, déjà réalisés, en travaux et ceux reportés après 2026.`;
useHead({
  title: `Carte de la Voie Lyonnaise ${line}`,
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description }
  ]
});
</script>
