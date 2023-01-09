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

    <h2>Total des passages par mois</h2>
    <p>On regarde ici pour chaque année le nombre total de passages par mois. Pour bien comprendre les courbes des années 2020 et 2021, il faut avoir en tête les dates des 3 confinements en France :</p>
    <ul>
      <li>Du 17 mars au 11 mai 2020 (1 mois et 25 jours)</li>
      <li>Du 30 octobre au 15 décembre 2020 (1 mois et 15 jours)</li>
      <li>Du 3 avril au 3 mai 2021 (28 jours)</li>
    </ul>
    <ChartTotalByMonth :data="data" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" />

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
