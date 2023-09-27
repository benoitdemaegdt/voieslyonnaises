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
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Page en cours de construction.
        </p>
        <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Elle sera destinée à suivre le réseau de plus de 70 compteurs vélo afin de pouvoir mesurer efficacement l'évolution de la pratique cyclable au sein de la métropole.
        </p>
      </div>
      <div class="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
        <NuxtLink v-for="counter of counters" :key="counter.name" :to="counter._path" class="flex flex-col rounded-lg shadow-lg overflow-hidden">
          <div class="flex-shrink-0">
            <img class="h-48 w-full object-cover" :src="counter.imageUrl" alt="">
          </div>
          <div class="flex-1 bg-white p-6 flex flex-col justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-lvv-blue-600">
                {{ counter.arrondissement }}
              </p>
              <div class="block mt-2">
                <p class="text-xl font-semibold text-gray-900">
                  {{ counter.name }}
                </p>
                <!--                <p class="mt-3 text-base text-gray-500">-->
                <!--                  {{ counter.description }}-->
                <!--                </p>-->
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
  return queryContent('compteurs').without('counts').find()
})
</script>
