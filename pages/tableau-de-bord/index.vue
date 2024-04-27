<template>
  <div class="max-w-7xl mx-auto mt-14 px-4 sm:px-6 lg:px-8 lg:mt-24">
    <h1 class="text-center text-3xl text-lvv-blue-600 font-bold mb-8">
      Tableau de bord de suivi des Voies Lyonnaises
    </h1>
    <div class="text-center text-xl text-gray-900">
      Distance totale du réseau: <span class="font-bold">
        {{ displayDistanceInKm(getTotalDistance(voies), 1) }}
      </span>
    </div>
    <ProgressBar :voies="voies" />
    <Stats :voies="voies" :precision="1" class="mt-8 max-w-2xl mx-auto" />
    <Typology :voies="voies" class="mt-8 max-w-2xl mx-auto" />

    <div v-for="(voie, i) in voies" :key="voie.line" class="py-2 border-t border-gray-200" :style="`background-color: ${getLineColor(voie.line)}11`">
      <h2 class="text-center text-2xl">
        <LineLink :line="String(voie.line)" />
      </h2>
      <div class="text-center text-xl text-gray-900">
        Distance totale: <span class="font-bold" :style="`color: ${getLineColor(voie.line)}`">
          {{ displayDistanceInKm(getTotalDistance([voie]), 1) }}
        </span>
      </div>
      <div class="text-center text-sm text-gray-900">
        Fréquentation max 2030: <span class="font-bold" :style="`color: ${getLineColor(voie.line)}`">
          {{ voie.trafic }}
        </span>
      </div>
      <ProgressBar :voies="[voie]" />
      <Stats :voies="[voie]" :precision="1" class="mt-8 max-w-2xl mx-auto" />
      <Typology :voies=[voie] class="mt-8 max-w-2xl mx-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { getLineColor } = useColors();
const { getTotalDistance, displayDistanceInKm } = useStats();

const { data: jsons } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'json' }).find();
});
const { data: mds } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'markdown' }).find();
});

const voies = jsons.value.map((j, i) => ({ ...j, line: mds.value[i].line, trafic: mds.value[i].trafic }));
</script>
