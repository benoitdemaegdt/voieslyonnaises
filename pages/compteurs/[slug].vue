<template>
  <ContentFrame
    v-if="data"
    header="compteur vélo"
    :title="data.name"
    :description="data.description"
    :image-url="data.imageUrl"
  >
    <h2>Total des passages par année</h2>
    <p>Ce premier diagramme représente le nombre total de passages détecté par le compteur vélo chaque année.</p>
    <ChartTotalByYear :data="data" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" />

    <h2>Comparaison des passages pour un mois donné</h2>
    <p>Choisissez un mois dans le menu déroulant ci-dessous pour visualiser l'évolution de la fréquentation cyclable pour le même mois de chaque année.</p>
    <ChartMonthComparison :data="data" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" />

    <template v-if="data.limitation">
      <h2>Limitation</h2>
      <p>{{ data.limitation }}</p>
    </template>

    <h2>Source des données</h2>
    <p>Les données proviennent de <a href="https://data.eco-counter.com/ParcPublic/?id=3902#" target="_blank">data.eco-counter.com</a>.</p>
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()
const { withoutTrailingSlash } = useUrl()

const { data } = await useAsyncData(`compteur-${path}`, () => {
  return queryContent()
    .where({ _path: withoutTrailingSlash(path) })
    .findOne()
})

if (!data.value) {
  const router = useRouter()
  router.push({ path: '/404' })
}

const DESCRIPTION = `Compteur vélo ${data.value.name}`
const IMAGE_URL = data.value.imageUrl
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: DESCRIPTION },
    { hid: 'og:description', property: 'og:description', DESCRIPTION },
    { hid: 'twitter:description', name: 'twitter:description', DESCRIPTION },
    // cover image
    { hid: 'og:image', property: 'og:image', content: IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: IMAGE_URL }
  ]
})
</script>
