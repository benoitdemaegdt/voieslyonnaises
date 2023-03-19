<template>
  <ContentFrame
    header="Voie lyonnaise"
    :title="`Ligne ${voie.line}`"
    :description="voie.description"
    :image-url="voie.cover"
  >
    <h2>Aperçu de la voie lyonnaise n°{{ voie.line }}</h2>
    <Overview :voie="voie" />
    <ContentRenderer :value="voie" />
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()

// https://github.com/nuxt/framework/issues/3587
definePageMeta({ pageTransition: false })

const { data: voie } = await useAsyncData(`${path}`, () => {
  return queryContent().where({ _path: path, _type: 'markdown' }).findOne()
})

const description = `Avancement de la voie lyonnaise n°${voie.value.line}`
const coverImage = voie.value.cover
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description },
    // cover image
    { hid: 'og:image', property: 'og:image', content: coverImage },
    { hid: 'twitter:image', name: 'twitter:image', content: coverImage }
  ]
})
</script>
