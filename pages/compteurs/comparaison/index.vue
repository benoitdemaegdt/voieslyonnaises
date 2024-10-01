<template>
  <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
    <div class="absolute inset-0">
      <div class="bg-white h-1/3 sm:h-2/3" />
    </div>
    <div class="relative max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
          Comparaison de la fréquentation cycliste et automobile.
        </h2>
        <p class="mt-8 text-xl text-gray-500 leading-8">
          Cette page permet de comparer l'évolution des fréquentations cyclistes et automobiles sur un même axe.
        </p>
        <!-- <ClientOnly>
          <Map :features="features" :options="{ legend: false, filter: false }" class="mt-12" style="height: 40vh" />
        </ClientOnly> -->
      </div>

      <!-- liste des compteurs -->
      <div class="mt-8 max-w-7xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="counter of counters" :key="counter.name" :to="`/compteurs/comparaison/${counter.cyclopolisId}`" class="flex flex-col rounded-lg shadow-md hover:shadow-lg overflow-hidden">
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
                  {{ getLastRecord(counter).month }}
                </th>
                <th class="w-1/4">
                  {{ getLastRecordPreviousYear(counter).year }}
                </th>
                <th class="w-1/4">
                  {{ getLastRecord(counter).year }}
                </th>
                <th class="w-1/4 italic font-normal border-l-2 border-lvv-blue-600">
                  évolution
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <!-- vélo -->
              <tr>
                <td class="text-center p-1">
                  <Icon name="fluent:vehicle-bicycle-16-regular" class="text-3xl" />
                </td>
                <td class="text-center p-1">
                  {{ getLastRecordPreviousYear(counter).veloCount }}
                </td>
                <td class="text-center p-1">
                  {{ getLastRecord(counter).veloCount }}
                </td>
                <td class="text-center p-1 border-l-2 border-lvv-blue-600">
                  <div v-if="getCounterEvolution(counter).veloEvolution === 0">
                    N/A
                  </div>
                  <div v-else-if="getCounterEvolution(counter).veloEvolution > 0" class="text-green-600 flex items-center justify-center">
                    <Icon name="mdi:arrow-top-right-thin" />
                    <span>+{{ getCounterEvolution(counter).veloEvolution }}% </span>
                  </div>
                  <div v-else-if="getCounterEvolution(counter).veloEvolution < 0" class="text-red-600 flex items-center justify-center">
                    <Icon name="mdi:arrow-bottom-right-thin" />
                    <span>{{ getCounterEvolution(counter).veloEvolution }}% </span>
                  </div>
                </td>
              </tr>
              <!-- voiture -->
              <tr>
                <td class="text-center p-1">
                  <Icon name="fluent:vehicle-car-profile-16-regular" class="text-3xl" />
                </td>
                <td class="text-center p-1">
                  {{ getLastRecordPreviousYear(counter).voitureCount }}
                </td>
                <td class="text-center p-1">
                  {{ getLastRecord(counter).voitureCount }}
                </td>
                <td class="text-center p-1 border-l-2 border-lvv-blue-600">
                  <div v-if="getCounterEvolution(counter).voitureEvolution === 0">
                    N/A
                  </div>
                  <div v-else-if="getCounterEvolution(counter).voitureEvolution > 0" class="text-green-600 flex items-center justify-center">
                    <Icon name="mdi:arrow-top-right-thin" />
                    <span>+{{ getCounterEvolution(counter).voitureEvolution }}% </span>
                  </div>
                  <div v-else-if="getCounterEvolution(counter).voitureEvolution < 0" class="text-red-600 flex items-center justify-center">
                    <Icon name="mdi:arrow-bottom-right-thin" />
                    <span>{{ getCounterEvolution(counter).voitureEvolution }}% </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  cyclopolisId: string;
  arrondissement: string;
  coordinates: [number, number];
  counts: { month: string, veloCount: number, voitureCount: number }[];
};

const counters = allVeloCounters.value?.map(veloCounter => {
  const voitureCounter = allVoitureCounters.value?.find(voitureCounter => voitureCounter.cyclopolisId === veloCounter.cyclopolisId);
  if (!voitureCounter) { return undefined; }
  return {
    name: veloCounter.name,
    cyclopolisId: veloCounter.cyclopolisId,
    arrondissement: veloCounter.arrondissement,
    coordinates: veloCounter.coordinates,
    counts: voitureCounter.counts.map((voitureCount: Count) => {
      const veloCount = veloCounter.counts.find((veloCount: Count) => veloCount.month === voitureCount.month);
      return {
        month: voitureCount.month,
        veloCount: veloCount?.count || 0,
        voitureCount: voitureCount.count
      };
    })
  };
}).filter((counter): counter is Counter => !!counter) || [];

function getLastRecord(counter: Counter) {
  const lastRecord = counter.counts.at(-1);
  return {
    month: new Date(lastRecord!.month).toLocaleString('fr-Fr', { month: 'short' }),
    year: new Date(lastRecord!.month).toLocaleString('fr-Fr', { year: 'numeric' }),
    veloCount: lastRecord!.veloCount,
    voitureCount: lastRecord!.voitureCount
  };
}

/**
 * permet de comparer le dernier enregistrement, avec celui de l'année précédente
 */
function getLastRecordPreviousYear(counter: Counter) {
  const lastRecord = counter.counts.at(-1);
  const lastRecordMonth = new Date(lastRecord!.month).getMonth();
  const lastRecordYear = new Date(lastRecord!.month).getFullYear();

  const lastRecordPreviousYear = counter.counts.find(count => {
    const countMonth = new Date(count.month).getMonth();
    const countYear = new Date(count.month).getFullYear();
    return countMonth === lastRecordMonth && countYear === lastRecordYear - 1;
  });
  return {
    month: new Date(lastRecordPreviousYear!.month).toLocaleString('fr-Fr', { month: 'short' }),
    year: new Date(lastRecordPreviousYear!.month).toLocaleString('fr-Fr', { year: 'numeric' }),
    veloCount: lastRecordPreviousYear!.veloCount,
    voitureCount: lastRecordPreviousYear!.voitureCount
  };
}

function getCounterEvolution(counter: Counter) {
  const lastRecord = getLastRecord(counter);
  const lastRecordPreviousYear = getLastRecordPreviousYear(counter);
  // const veloEvolution = lastRecord.veloCount === 0 ? 0 : Math.round((lastRecord.veloCount - lastRecordPreviousYear.veloCount) / lastRecord.veloCount * 100);
  let veloEvolution;
  if (lastRecord.veloCount === 0) { veloEvolution = 0; }
  if (lastRecordPreviousYear.veloCount === 0) { veloEvolution = 0; }
  veloEvolution = Math.round((lastRecord.veloCount - lastRecordPreviousYear.veloCount) / lastRecord.veloCount * 100);

  let voitureEvolution;
  if (lastRecord.voitureCount === 0) { voitureEvolution = 0; }
  if (lastRecordPreviousYear.voitureCount === 0) { voitureEvolution = 0; }
  voitureEvolution = Math.round((lastRecord.voitureCount - lastRecordPreviousYear.voitureCount) / lastRecord.voitureCount * 100);

  return { veloEvolution, voitureEvolution };
}

</script>
