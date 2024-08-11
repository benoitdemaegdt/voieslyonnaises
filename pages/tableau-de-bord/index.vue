<template>
  <div class="max-w-4xl mx-auto mt-14 px-4 sm:px-6 lg:px-8 lg:mt-24">
    <h1 class="text-center text-3xl text-lvv-blue-600 font-bold mb-8">
      Tableau de bord de suivi des {{ config.revName.plural }}
    </h1>
    <div v-if="!voies">
      Chargement ...
    </div>
    <div v-else>
      <ProgressBar :voies="voies" />
      <Stats :voies="voies" :precision="1" class="mt-8 max-w-2xl mx-auto" />
      <Typology :voies="voies" class="mt-8 max-w-2xl mx-auto" />

      <div v-for="voie in voies" :key="voie.line" class="py-2 my-8 flex">
        <div class="mr-4 w-2 lg:w-4 rounded-lg" :style="`background: ${getLineColor(getLine(voie))}`" />
        <div class="max-w-2xl mx-auto flex-grow">
          <h2 class="text-center text-2xl font-bold">
            <LineLink :line="String(getLine(voie))" />
          </h2>
          <div class="text-center text-xl text-gray-900">
            Distance totale: <span class="font-bold" :style="`color: ${getLineColor(getLine(voie))}`">
              {{ displayDistanceInKm(getTotalDistance([voie]), 1) }}
            </span>
          </div>
          <div v-if="voie.trafic" class="text-center text-sm text-gray-900">
            Fréquentation max 2030: <span class="font-bold" :style="`color: ${getLineColor(getLine(voie))}`">
              {{ getTrafic(voie) }}
            </span>
          </div>
          <div>
            <ProgressBar :voies="[voie]" />
            <Stats :voies="[voie]" :precision="1" class="mt-8" />
            <Typology :voies="[voie]" class="mt-8 max-w-2xl mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content';
import type { Feature } from '../../types';
import config from '../../config.json';
interface Geojson extends ParsedContent {
  type: string;
  features: Feature[];
}
interface Mds extends ParsedContent {
  trafic: string
}

const { getLineColor } = useColors();
const { getTotalDistance, displayDistanceInKm } = useStats();

const { data: voies } = await useAsyncData(() => {
  return queryContent<Geojson>('voies-cyclables').where({ _type: 'json' }).find();
});
const { data: mds } = await useAsyncData(() => {
  return queryContent<Mds>('voies-cyclables').where({ _type: 'markdown' }).find();
});

function getLine(voie: Geojson): number {
  return voie.features[0].properties.line;
}

function getTrafic(voie: Geojson): string {
  const line = getLine(voie);
  const trafic = mds.value?.find((md) => md.line === line)?.trafic;
  return trafic || 'Inconnu';
}

const description = `Tableau de bord de suivi des ${config.revName.plural} en temps réel.`;
useHead({
  title: `Tableau de bord de suivi des ${config.revName.plural}`,
  meta: [
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description }
  ]
});
</script>
