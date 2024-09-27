<template>
  <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="absolute inset-0">
      <div class="bg-white h-1/3 sm:h-2/3" />
    </div>
    <div class="relative max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
          Comparaison de la fréquentation cycliste et automobile de certains axes
        </h2>
        <p class="mt-8 text-xl text-gray-500 leading-8">
          Lorem Ipsum
        </p>
        <!-- <ClientOnly>
          <Map :features="features" :options="{ legend: false, filter: false }" class="mt-12" style="height: 40vh" />
        </ClientOnly> -->
      </div>

      <!-- liste des compteurs -->
      <div class="mt-4 max-w-7xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none">
        <div v-for="counter of counters" :key="counter.name" class="flex flex-col rounded-lg shadow-md hover:shadow-lg overflow-hidden">
          <div>
            <div class="px-4 py-2 bg-lvv-blue-600 text-white">
              <div class="text-base font-medium">
                {{ counter.arrondissement }}
              </div>
              <div class="mt-1 text-lg font-semibold">
                {{ counter.name }}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr class="bg-lvv-blue-100">
                <th class="w-1/6 italic font-normal">
                  {{ getCounterLastRecord(counter).month }}
                </th>
                <th class="w-1/4">
                  {{ getCounterLastRecordPreviousYear(counter).year }}
                </th>
                <th class="w-1/4">
                  {{ getCounterLastRecord(counter).year }}
                </th>
                <th class="w-1/4 italic font-normal border-l-2 border-lvv-blue-600">
                  évolution
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center p-1">
                  <Icon name="game-icons:dutch-bike" class="text-3xl" />
                </td>
                <td class="text-center p-1">
                  {{ getCounterLastRecordPreviousYear(counter).value }}
                </td>
                <td class="text-center p-1">
                  <div class="flex items-center justify-center">
                    <span>{{ getCounterLastRecord(counter).value }}</span>
                    <Icon v-if="isLastRecordMax(counter)" name="iconoir:medal-1st-solid" class="text-lvv-pink text-xl" />
                  </div>
                </td>
                <td class="text-center p-1 border-l-2 border-lvv-blue-600">
                  <span v-if="getEvolution(counter) === 0 " class="text-green-600">
                    N/A
                  </span>
                  <span v-if="getEvolution(counter) > 0 " class="text-green-600">
                    <Icon name="mdi:arrow-top-right-thin" />
                    +{{ getEvolution(counter) }}%
                  </span>
                  <span v-if="getEvolution(counter) < 0 " class="text-red-600">
                    <Icon name="mdi:arrow-bottom-right-thin" />
                    {{ getEvolution(counter) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getCounterLastRecord, getCounterLastRecordPreviousYear, getEvolution, isLastRecordMax } = useCompteur();
/**
 * la clé cyclopolisId sert à faire le lien entre les compteurs vélo et voiture
 * cette page compare les 2 sur un même axe, on ne s'intéresse donc qu'à ceux qui ont
 * un cyclopolisId
 */
const { data: allVeloCounters } = await useAsyncData(() => {
  return queryContent('compteurs/velo').where({ cyclopolisId: { $exists: true } }).find();
});

const { data: allVoitureCounters } = await useAsyncData(() => {
  return queryContent('compteurs/voiture').where({ cyclopolisId: { $exists: true } }).find();
});

type Counter = {
  name: string;
  arrondissement: string;
  coordinates: [number, number];
  veloCounts: { month: string; count: number }[];
  voitureCounts: { month: string; count: number }[];
};

const counters = allVeloCounters.value?.map(veloCounter => {
  const voitureCounter = allVoitureCounters.value?.find(voitureCounter => voitureCounter.cyclopolisId === veloCounter.cyclopolisId);
  if (!voitureCounter) { return undefined; }
  return {
    name: veloCounter.name,
    arrondissement: veloCounter.arrondissement,
    coordinates: veloCounter.coordinates,
    veloCounts: veloCounter.counts,
    voitureCounts: voitureCounter.counts
  };
}).filter((counter): counter is Counter => !!counter) || [];

</script>
