<template>
  <div class="max-w-4xl mx-auto mt-14 px-4 sm:px-6 lg:px-8 lg:mt-24">
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

    <div
      v-for="voie in voies"
      :key="voie.line"
      class="py-2 my-8"
      :style="`border-left: 16px solid ${getLineColor(voie.line)}`">
      <h2 class="text-center text-2xl font-bold">
        <LineLink :line="String(voie.line)" :monochrome="true" />
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
      <div class="max-w-2xl mx-auto">
        <ProgressBar :voies="[voie]" />
        <Stats :voies="[voie]" :precision="1" class="mt-8" />
        <Typology :voies="[voie]" class="mt-8 max-w-2xl mx-auto" />
        <Disclosure v-slot="{ open }">
          <DisclosureButton class="flex w-full justify-center cursor-pointer text-sm">
            <Icon name="mdi:chevron-down"
                  :class="[open ? 'rotate-180 transform' : '', 'ml-2 h-5 w-5']"
                  aria-hidden="true" />
            {{ open ? 'Masquer' : 'Afficher' }} la carte
          </DisclosureButton>
          <DisclosurePanel>
            <ClientOnly>
              <Map :features="voie.features" :options="mapOptions" :line-id="voie.line" style="height: 40vh" />
            </ClientOnly>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
const { getLineColor } = useColors();
const { getTotalDistance, displayDistanceInKm } = useStats();

const { data: jsons } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'json' }).find();
});
const { data: mds } = await useAsyncData(() => {
  return queryContent('voies-lyonnaises').where({ _type: 'markdown' }).find();
});

const voies = jsons.value.map((j, i) => ({ ...j, line: mds.value[i].line, trafic: mds.value[i].trafic }));

const mapOptions = {
  fullscreen: true,
  onFullscreenControlClick: () => {
    const route = useRoute();
    return navigateTo({ path: `${route.params._slug}/carte` });
  }
};
</script>
