
<template>
  <div class="bg-white">
    <main class="pt-10 sm:pt-16">
      <!-- Image gallery -->
      <div class="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-8">
        <div class="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
          <img :src="voie.images[0].src" :alt="voie.images[0].alt" class="w-full h-full object-center object-cover">
        </div>
        <div class="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
          <div class="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
            <img :src="voie.images[1].src" :alt="voie.images[1].alt" class="w-full h-full object-center object-cover">
          </div>
          <div class="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
            <img :src="voie.images[2].src" :alt="voie.images[2].alt" class="w-full h-full object-center object-cover">
          </div>
        </div>
        <div class="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
          <img :src="voie.images[3].src" :alt="voie.images[3].alt" class="w-full h-full object-center object-cover">
        </div>
      </div>

      <div class="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
        <!-- Titre (Nom de la ligne) -->
        <div class="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <h1 class="flex items-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            <div>Ligne</div>
            <div
              class="ml-2 h-9 w-9 rounded-full flex items-center justify-center text-white font-bold"
              :style="`background-color: ${voie.color}`"
            >
              {{ voie.line }}
            </div>
          </h1>
        </div>

        <!-- Description, stats & map -->
        <div class="py-10 lg:py-6 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
          <div>
            <h3 class="sr-only">
              Description
            </h3>
            <div class="space-y-6">
              <p class="text-base text-gray-900">
                {{ voie.description }}
              </p>
              <dl class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-base font-normal text-gray-900">
                    Distance
                  </dt>
                  <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div class="flex items-baseline text-2xl font-semibold" :style="`color: ${voie.color}`">
                      {{ Math.round(voie.distance/1000) }}km
                    </div>
                  </dd>
                </div>
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-base font-normal text-gray-900">
                    Fréquentation
                  </dt>
                  <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div class="flex items-baseline text-2xl font-semibold" :style="`color: ${voie.color}`">
                      {{ voie.trafic }}
                    </div>
                  </dd>
                </div>
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-base font-normal text-gray-900">
                    Avancement
                  </dt>
                  <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
                    <div class="flex items-baseline text-2xl font-semibold" :style="`color: ${voie.color}`">
                      {{ avancement }}%
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <section aria-labelledby="shipping-heading" class="mt-10">
            <Map :voie="voie" />
          </section>
        </div>

        <!-- Dernières nouvelles -->
        <div class="mt-4 lg:mt-0 lg:row-start-1 lg:col-start-3 lg:row-span-3">
          <h2 class="text-xl font-bold sm:text-2xl text-gray-900">
            Dernières nouvelles
          </h2>
          <div class="mt-6">
            <section aria-labelledby="announcements-title" class="flex flex-col gap-16">
              <div class="overflow-hidden">
                <div class="flow-root">
                  <ul role="list" class="-my-5">
                    <li v-for="(announcement, index) in voie.announcements" :key="index" class="py-5">
                      <div class="relative">
                        <time class="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 pl-3.5" datetime="2022-09-05">
                          <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                            <span class="h-4 w-0.5 bg-zinc-200" />
                          </span>
                          {{ announcement.date }}
                        </time>
                        <h3 class="text-sm font-semibold text-gray-800">
                          {{ announcement.title }}
                        </h3>
                        <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                          {{ announcement.text }}
                        </p>
                        <NuxtLink
                          v-if="announcement.link"
                          :to="announcement.link"
                          target="_blank"
                          area-hidden="true"
                          class="relative z-10 mt-2 flex items-center text-sm font-medium"
                          :style="`color: ${voie.color}`"
                        >
                          {{ announcement.anchor }}
                          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="ml-1 h-4 w-4 stroke-current">
                            <path d="M6.75 5.75 9.25 8l-2.5 2.25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </NuxtLink>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-if="voie.announcements.length > 4" class="mt-6">
                  <button class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Tout voir
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-products-heading" class="bg-white">
        <div class="max-w-2xl mx-auto py-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 id="related-products-heading" class="text-xl font-bold tracking-tight text-gray-900">
            Les autres lignes
          </h2>
          <p class="text-md text-gray-500">
            Choisissez l'une des autres voies lyonnaises pour voir son niveau d'avancement.
          </p>
          <HomeLinesSection class="mt-6" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const { path } = useRoute()

// https://github.com/nuxt/framework/issues/3587
definePageMeta({ pageTransition: false })

const { data: voie } = await useAsyncData(`${path}`, () => {
  return queryContent().where({ _path: path }).findOne()
})

const avancement = Math.round(voie.value.sections
  .filter(section => section.properties.status === 'done')
  .map(section => section.properties.distance || 0)
  .reduce((acc, current) => acc + current, 0) * 100 / voie.value.distance)

const description = `Avancement de la voie lyonnaise n°${voie.value.line}`
const coverImage = voie.value.cover
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description },
    // cover image
    { hid: 'og:image', property: 'og:image', content: coverImage },
    { hid: 'twitter:image', name: 'twitter:image', content: coverImage }
  ]
})
</script>
