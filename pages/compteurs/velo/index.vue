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
          <Map :features="features" :options="{ legend: false }" class="mt-12" style="height: 40vh" />
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
          <div class="relative bg-lvv-blue-100">
            <div v-if="isLastRecordMax(counter)" class="absolute top-2 right-2 bg-lvv-pink text-sm text-white font-semibold rounded-xl px-1.5">
              record
            </div>
            <div class="px-4 py-4 flex flex-col">
              <div class="text-base font-medium text-lvv-blue-600">
                {{ counter.arrondissement }}
              </div>
              <div class="mt-1 text-xl font-semibold text-gray-900">
                {{ counter.name }}
              </div>
            </div>
          </div>
          <div class="px-4 py-4 flex flex-col">
            <div class="flex justify-between">
              <div>{{ getCounterLastRecord(counter).date }}</div>
              <div>{{ getCounterLastRecord(counter).value }} passages</div>
            </div>
            <div class="border-t border-gray-200 my-2" />
            <div class="flex justify-between">
              <div>{{ getCounterLastRecordPreviousYear(counter).month }}</div>
              <div>{{ getCounterLastRecordPreviousYear(counter).value }} passages</div>
            </div>
          </div>
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
  return {
    date: new Date(counter.counts.at(-1).month).toLocaleString('fr-Fr', { month: 'short', year: 'numeric' }),
    value: counter.counts.at(-1).count.toLocaleString('fr-FR')
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
    month: new Date(lastRecordMonthPreviousYear).toLocaleString('fr-Fr', { month: 'short', year: 'numeric' }),
    value: lastRecordMonthPreviousYearCount?.toLocaleString('fr-FR') ?? 0
  };
}

const features = getCompteursFeatures({ counters: allCounters.value, type: 'compteur-velo' });
</script>
