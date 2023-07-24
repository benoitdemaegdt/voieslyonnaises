<template>
  <ContentFrame
    header="piste cyclable"
    :title="`voie lyonnaise ${voie.line}`"
    :description="voie.description"
    :image-url="voie.cover"
  >
    <h2>Aperçu</h2>
    <Overview :voie="voie" />
    <ContentRenderer :value="voie" />
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()

const regex = /voie-lyonnaise-(1[0-2]|[1-9])\b/
const line = path.match(regex)[1]

// https://github.com/nuxt/framework/issues/3587
definePageMeta({
  pageTransition: false,
  middleware: 'voie-lyonnaise'
})

const { data: voie } = await useAsyncData(`${path}`, () => {
  return queryContent('voies-lyonnaises').where({ _type: 'markdown', line: Number(line) }).findOne()
})

const description = `Découvrez la voie lyonnaise n°${voie.value.line}. Carte, itinéraire rue par rue, calendrier des travaux, photos du projet et dossiers de concertation.`
const coverImage = voie.value.cover
useHead({
  title: `Voie Lyonnaise n°${voie.value.line}`,
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
