<template>
  <ClientOnly>
    <Map :features="features" :options="mapOptions" class="h-full w-full" />
  </ClientOnly>
</template>

<script setup>
const { path } = useRoute()

const regex = /voie-lyonnaise-(1[0-2]|[1-9])\b/
const line = path.match(regex)[1]

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  layout: 'fullscreen',
  middleware: 'voie-lyonnaise'
})

const mapOptions = {
  shrink: true,
  onShrinkControlClick: () => {
    const route = useRoute()
    return navigateTo({ path: `/${route.params._slug}` })
  }
}

const { data: voie } = await useAsyncData(() => {
  return queryContent().where({ _path: `/voies-lyonnaises/ligne-${line}`, _type: 'json' }).findOne()
})

const features = voie.value.features

const description = `Carte de la voie lyonnaise n°${line}. Découvrez les tronçons prévus, déjà réalisés et ceux qui sont en travaux.`
useHead({
  title: `Carte de la voie Lyonnaise n°${line}`,
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description }
  ]
})
</script>
