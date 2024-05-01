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
          <div class="relative">
            <div class="absolute top-4 right-4 bg-lvv-pink text-white font-semibold rounded-xl px-2 py-0.5">
              {{ getCounterLastRecord(counter).month }}
            </div>
            <div class="px-4 py-4 bg-lvv-blue-600 text-white">
              <div class="text-base font-medium">
                {{ counter.arrondissement }}
              </div>
              <div class="mt-1 text-xl font-semibold">
                {{ counter.name }}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr class="bg-lvv-blue-100">
                <th class="w-1/6 italic font-normal">
                  total
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
                <td class="text-center p-2">
                  <Icon name="game-icons:dutch-bike" class="text-3xl" />
                </td>
                <td class="text-center p-2">
                  {{ getCounterLastRecordPreviousYear(counter).value }}
                </td>
                <td class="text-center p-2">
                  {{ getCounterLastRecord(counter).value }}
                  <Icon v-if="isLastRecordMax(counter)" name="iconoir:medal-1st-solid" class="text-lvv-pink text-xl" />
                </td>
                <td class="text-center p-2 border-l-2 border-lvv-blue-600">
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

const { data: allCounters } = await useAsyncData(() => {
  return queryContent('compteurs/velo').find();
});

const searchText = ref('');

const counters = computed(() => {
  return allCounters.value
    .sort((counter1, counter2) => counter2.counts.at(-1).count - counter1.counts.at(-1).count)
    .filter(counter => counter.name.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase().includes(searchText.value.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLowerCase()));
});

function getCounterLastRecord(counter) {
  const last = counter.counts.at(-1);
  return {
    month: new Date(last.month).toLocaleString('fr-Fr', { month: 'short' }),
    year: new Date(last.month).toLocaleString('fr-Fr', { year: 'numeric' }),
    value: counter.counts.at(-1).count.toLocaleString('fr-FR'),
    raw: counter.counts.at(-1).count
  };
}

function isLastRecordMax(counter) {
  const lastRecord = counter.counts.at(-1);
  return !counter.counts
    .filter(count => new Date(count.month).getMonth() === new Date(lastRecord.month).getMonth())
    .some(count => count.count > lastRecord.count);
}

// get record of same month of last record but previous year
// ex : last record is November 2023. Should return record of November 2022
function getCounterLastRecordPreviousYear(counter) {
  const lastRecordMonth = new Date(counter.counts.at(-1).month).getMonth();
  const lastRecordYear = new Date(counter.counts.at(-1).month).getFullYear();
  const lastRecordMonthPreviousYear = new Date(lastRecordYear - 1, lastRecordMonth, 1);
  const lastRecordMonthPreviousYearCount = counter.counts.find(count => new Date(count.month).getTime() === lastRecordMonthPreviousYear.getTime())?.count;
  return {
    month: new Date(lastRecordMonthPreviousYear).toLocaleString('fr-Fr', { month: 'short' }),
    year: new Date(lastRecordMonthPreviousYear).toLocaleString('fr-Fr', { year: 'numeric' }),
    value: lastRecordMonthPreviousYearCount?.toLocaleString('fr-FR') ?? 0,
    raw: lastRecordMonthPreviousYearCount
  };
}

function getEvolution(counter) {
  return ((getCounterLastRecord(counter).raw - getCounterLastRecordPreviousYear(counter).raw) * 100 / getCounterLastRecordPreviousYear(counter).raw).toFixed(1);
}

const features = getCompteursFeatures({ counters: allCounters.value, type: 'compteur-velo' });
</script>
