<template>
  <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="absolute inset-0">
      <div class="bg-white h-1/3 sm:h-2/3" />
    </div>
    <div class="relative max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
          Suivi des compteurs vélo de l'agglomération lyonnaise
        </h2>
        <p class="mt-8 text-xl text-gray-500 leading-8">
          Chaque début de mois, nous remontons les données de {{ counters.length }} compteurs à vélo de l'agglomération lyonnaise.
        </p>
        <ClientOnly>
          <Map :features="features" :options="{ legend: false, filter: false }" class="mt-12" style="height: 40vh" />
        </ClientOnly>
      </div>

      <!-- search bar -->
      <div class="mt-4">
        <label for="compteur" class="sr-only">Compteur</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="mdi:magnify" class="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <input id="compteur" v-model="searchText" type="text" class="py-4 pl-10 pr-4 text-lg shadow-md focus:ring-lvv-blue-600 focus:border-lvv-blue-600 block w-full border-gray-900 text-gray-900 rounded-md" placeholder="Chercher un compteur...">
        </div>
      </div>

      <!-- liste des compteurs -->
      <div class="mt-4 max-w-7xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="counter of counters" :key="counter.name" :to="counter._path" class="flex flex-col rounded-lg shadow-md hover:shadow-lg overflow-hidden">
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
                  {{ getCounterLastRecord(counter).value }}
                  <Icon v-if="isLastRecordMax(counter)" name="iconoir:medal-1st-solid" class="text-lvv-pink text-xl" />
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
</template>

<script setup>
const { getCompteursFeatures } = useMap();
const { getCounterLastRecord, getCounterLastRecordPreviousYear, getEvolution, isLastRecordMax } = useCompteur();

const { data: allCounters } = await useAsyncData(() => {
  return queryContent('compteurs/velo').find();
});

const searchText = ref('');

const counters = computed(() => {
  return allCounters.value
    .sort((counter1, counter2) => counter2.counts.at(-1).count - counter1.counts.at(-1).count)
    .filter(counter => counter.name.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase().includes(searchText.value.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase()));
});

const features = getCompteursFeatures({ counters: allCounters.value, type: 'compteur-velo' });
</script>
