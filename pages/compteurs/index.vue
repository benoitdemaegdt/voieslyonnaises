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
        <ClientOnly>
          <Map :features="features" :options="{ legend: false }" class="mt-12" style="height: 40vh" />
        </ClientOnly>
      </div>
      <div class="mt-12 flex items-center gap-2">
        <div>
          Trier les compteurs par:
        </div>
        <Listbox v-model="selectedSorter" class="w-72 z-20">
          <div class="relative mt-1">
            <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span class="block truncate">{{ selectedSorter.name }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon name="mdi:chevron-down" class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm list-none list-outside pl-0">
                <ListboxOption
                  v-for="sorter in sorters"
                  v-slot="{ active, selected }"
                  :key="sorter.name"
                  :value="sorter"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-lvv-blue-300 text-lvv-blue-400' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                    >{{ sorter.name }}</span>
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-lvv-blue-600"
                    >
                      <Icon name="mdi:check" class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="mt-12 max-w-7xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="counter of sortedCounters" :key="counter.name" :to="counter._path" class="flex flex-col rounded-lg shadow-lg overflow-hidden">
          <div class="flex-1 bg-white p-6 flex flex-col justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-lvv-blue-600">
                {{ counter.arrondissement }}
              </p>
              <div class="block mt-2 mb-2">
                <p class="text-xl font-semibold text-gray-900">
                  {{ counter.name }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue';

const { data } = await useAsyncData(() => {
  return queryContent('compteurs').find();
});

const sorters = [
  { name: 'Arrondissement' },
  { name: 'Nom' },
  { name: 'Fréquentation' }
];
const selectedSorter = ref(sorters[2]);

const counters = data.value.map((counter) => {
  return {
    ...counter,
    lastMonthCount: counter.counts.at(-1).count
  };
});

// value used to compute the meterbar on each card
const highestLastMountCount = counters.map(c => c.lastMonthCount).sort((a, b) => b - a)[0];

const sortedCounters = computed(() => {
  return counters.sort((a, b) => {
    switch (selectedSorter.value.name) {
      case 'Arrondissement':
        return a.arrondissement.localeCompare(b.arrondissement);

      case 'Nom':
        return a.name.localeCompare(b.name);

      case 'Fréquentation':
      default: {
        return b.lastMonthCount - a.lastMonthCount;
      }
    }
  });
});

const features = counters.map(counter => ({
  type: 'Feature',
  properties: {
    type: 'compteur',
    name: counter.name,
    link: counter._path,
    lastRecordDate: new Date(counter.counts.at(-1).month).toLocaleString('fr-Fr', { month: 'long', year: 'numeric' }),
    lastRecordValue: counter.counts.at(-1).count.toLocaleString('fr-FR')
  },
  geometry: {
    type: 'Point',
    coordinates: counter.coordinates
  }
}));
</script>
