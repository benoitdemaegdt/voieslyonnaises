<template>
  <div>
    <h1>Calendrier de la voie lyonnaise 1</h1>
    <ChartGanttChart />
  </div>
</template>

<script setup>
const { path } = useRoute();

const regex = /voie-lyonnaise-(1[0-2]|[1-9])\b/;
const line = path.match(regex)[1];

definePageMeta({
  pageTransition: false,
  middleware: 'voie-lyonnaise'
});

const { data: calendrier } = await useAsyncData(`${path}`, () => {
  return queryContent('calendriers')
    .where({ _type: 'json', _path: `/calendriers/ligne-${line}` })
    .findOne();
});

if (!calendrier.value) {
  const router = useRouter();
  router.push({ path: '/404' });
}

// console.log('calendrier >>', calendrier);

</script>
