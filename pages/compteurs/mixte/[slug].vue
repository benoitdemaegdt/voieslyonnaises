<template>
  <ContentFrame
    v-if="veloCounter"
    header="Comparaison fréquentation cycliste et automobile"
    :title="veloCounter.name"
  >
    <!-- <ClientOnly>
      <Map :features="features" :options="{ legend: false, filter: false }" class="mt-12" style="height: 40vh" />
    </ClientOnly> -->
    <h2>Total des passages par année</h2>
    <p>Ce premier diagramme représente le nombre total de passages détecté par le compteur vélo chaque année.</p>
    <!-- <ChartTotalByYear :title="graphTitles.totalByYear" :data="counter" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" /> -->

    <h2>Comparaison des passages pour un mois donné</h2>
    <p>Choisissez un mois dans le menu déroulant ci-dessous pour visualiser l'évolution de la fréquentation cyclable pour le même mois de chaque année.</p>
    <!-- <ChartMonthComparison :title="graphTitles.monthComparison" :data="counter" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" /> -->

    <h2>Source des données</h2>
    <p>Les données des compteurs vélo proviennent de <a href="https://data.eco-counter.com/ParcPublic/?id=3902#" target="_blank">data.eco-counter.com</a>.</p>
    <p>Les données des compteurs voiture proviennent du <a href="https://avatar.cerema.fr/cartographie" target="_blank">cerema</a>.</p>
  </ContentFrame>
</template>

<script setup>
const { params } = useRoute();

const { data: veloCounter } = await useAsyncData(() => {
  return queryContent('compteurs/velo').where({ cyclopolisId: params.slug }).findOne();
});

const { data: voitureCounter } = await useAsyncData(() => {
  return queryContent('compteurs/voiture').where({ cyclopolisId: params.slug }).findOne();
});

console.log(' ');
console.log(' ');
console.log('veloCounter >>', veloCounter.value);
console.log('voitureCounter >>', voitureCounter.value);
console.log(' ');
console.log(' ');

// if (!counter.value) {
//   const router = useRouter();
//   router.push({ path: '/404' });
// }

// const graphTitles = {
//   totalByYear: `Fréquentation cycliste annuelle - ${counter.value.name}`,
//   monthComparison: `Fréquentation cycliste - ${counter.value.name}`
// };

// const features = getCompteursFeatures({ counters: [counter.value], type: 'compteur-velo' });

// const DESCRIPTION = `Compteur vélo ${counter.value.name}`;
// const IMAGE_URL = counter.value.imageUrl;
// useHead({
//   meta: [
//     // description
//     { hid: 'description', name: 'description', content: DESCRIPTION },
//     { hid: 'og:description', property: 'og:description', DESCRIPTION },
//     { hid: 'twitter:description', name: 'twitter:description', DESCRIPTION },
//     // cover image
//     { hid: 'og:image', property: 'og:image', content: IMAGE_URL },
//     { hid: 'twitter:image', name: 'twitter:image', content: IMAGE_URL }
//   ]
// });
</script>
