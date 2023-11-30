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
          <Map :features="features" class="mt-12" style="height: 40vh" />
        </ClientOnly>
      </div>
      <div class="mt-12 max-w-7xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="counter of counters" :key="counter.name" :to="counter._path" class="flex flex-col rounded-lg shadow-lg overflow-hidden">
          <div class="flex-1 bg-white p-6 flex flex-col justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-lvv-blue-600">
                {{ counter.arrondissement }}
              </p>
              <div class="block mt-2">
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
const { data: counters } = await useAsyncData(() => {
  return queryContent('compteurs').without('counts').find();
});

const features = counters.value.map(counter => ({
  type: 'Feature',
  properties: {
    type: 'compteur',
    name: counter.name,
    link: counter._path
  },
  geometry: {
    type: 'Point',
    coordinates: counter.coordinates
  }
}));
</script>
