
<template>
  <div class="min-h-full">
    <Popover as="header" class="pb-24 bg-gradient-to-r from-sky-800 to-cyan-600" v-slot="{ open }">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div class="relative flex flex-wrap items-center justify-center lg:justify-between">

          <div class="w-full py-5 lg:border-t lg:border-white lg:border-opacity-20">
            <div class="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-center">
              <div class="px-12 lg:px-0"></div>
            </div>
          </div>
        </div>
      </div>
    </Popover>

    <main class="-mt-24 pb-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 class="sr-only">Profile</h1>
        <!-- Main 3 column grid -->
        <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          <!-- Left column -->
          <div class="grid grid-cols-1 gap-4 lg:col-span-2">
            <!-- Welcome panel -->
            <section aria-labelledby="profile-overview-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <h2 class="sr-only" id="profile-overview-title">Profile Overview</h2>
                <div class="bg-white p-6">
                  <div class="sm:flex sm:items-center sm:justify-between">
                    <div class="sm:flex sm:space-x-5">
                      <div class="flex-shrink-0">
                        <div
                          class="h-20 w-20 rounded-full flex items-center justify-center bg-ligne1 text-white text-3xl font-bold"
                          :style="`background-color: ${voie.color}`"
                        >
                          {{ voie.line }}
                        </div>
                      </div>
                      <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                        <p class="text-sm font-medium text-gray-600">Voie Lyonnaise</p>
                        <p class="text-xl font-bold text-gray-900 sm:text-2xl"> Ligne {{ voie.line }}</p>
                        <p class="text-sm font-medium text-gray-600">{{ voie.from }} → {{ voie.to }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-t border-gray-200 bg-gray-50 grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                  <div class="px-6 py-5 text-sm font-medium text-center">
                    <span class="text-gray-600">Distance:</span>
                      {{ ' ' }}
                    <span class="text-gray-900">{{ voie.distance }}</span>
                  </div>
                  <div class="px-6 py-5 text-sm font-medium text-center">
                    <span class="text-gray-600">Trafic:</span>
                      {{ ' ' }}
                    <span class="text-gray-900">{{ voie.trafic }}</span>
                  </div>
                  <div class="px-6 py-5 text-sm font-medium text-center">
                    <span class="text-gray-600">État:</span>
                      {{ ' ' }}
                    <span class="text-gray-900">{{ voie.status }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Map panel -->
            <section aria-labelledby="quick-links-title">
              <div class="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                <h2 class="sr-only" id="quick-links-title">Quick links</h2>
                <p>Map : work in progress</p>
              </div>
            </section>
          </div>

          <!-- Right column -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Announcements -->
            <section aria-labelledby="announcements-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <div class="p-6">
                  <h2 class="text-base font-medium text-gray-900" id="announcements-title">Actualités</h2>
                  <div class="flow-root mt-6">
                    <ul role="list" class="-my-5 divide-y divide-gray-200">
                      <li v-for="announcement in announcements" :key="announcement.id" class="py-5">
                        <div class="relative focus-within:ring-2 focus-within:ring-cyan-500">
                          <h3 class="text-sm font-semibold text-gray-800">
                            <a :href="announcement.href" class="hover:underline focus:outline-none">
                              <!-- Extend touch target to entire panel -->
                              <span class="absolute inset-0" aria-hidden="true" />
                              {{ announcement.title }}
                            </a>
                          </h3>
                          <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                            {{ announcement.preview }}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-6">
                    <a href="#" class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Tout voir </a>
                  </div>
                </div>
              </div>
            </section>

            <!-- Other lines -->
            <section aria-labelledby="other-lines-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <div class="p-6">
                  <h2 class="text-base font-medium text-gray-900" id="other-lines-title">Autres lignes</h2>
                  <div class="flow-root mt-6">
                    <ul role="list" class="-my-5 divide-y divide-gray-200">
                      <li v-for="voie in otherLines" :key="voie.line" class="py-4">
                        <div class="flex items-center space-x-4">
                          <div class="flex-shrink-0">
                            <div class="flex-shrink-0">
                              <div
                                class="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                                :style="`background-color: ${voie.color}`"
                              >
                                {{ voie.line }}
                              </div>
                            </div>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">
                              Ligne {{ voie.line }}
                            </p>
                            <p class="text-sm text-gray-500 truncate">
                              {{ voie.from }} → {{ voie.to }}
                            </p>
                          </div>
                          <div>
                            <NuxtLink :to="voie._path" class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"> Voir </NuxtLink>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-6">
                    <a href="#" class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Tout voir </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Popover } from '@headlessui/vue'

const { path } = useRoute()

const { data: voie } = await useAsyncData(`${path}`, () => {
  return queryContent().where({ _path: path }).findOne()
})

const { data: otherLines } = await useAsyncData(`surround-${path}`, () => {
  return queryContent().where({ _path: { $ne: path } }).limit(4).find()
})

const announcements = [
  {
    id: 1,
    title: 'Inauguration de la première portion',
    href: '#',
    preview:
      'Cum qui rem deleniti. Suscipit in dolor veritatis sequi aut. Vero ut earum quis deleniti. Ut a sunt eum cum ut repudiandae possimus. Nihil ex tempora neque cum consectetur dolores.',
  },
  {
    id: 2,
    title: 'Début des travaux de la première portion',
    href: '#',
    preview:
      'Alias inventore ut autem optio voluptas et repellendus. Facere totam quaerat quam quo laudantium cumque eaque excepturi vel. Accusamus maxime ipsam reprehenderit rerum id repellendus rerum. Culpa cum vel natus. Est sit autem mollitia.',
  },
  {
    id: 3,
    title: 'Réunion de concertation',
    href: '#',
    preview:
      'Tenetur libero voluptatem rerum occaecati qui est molestiae exercitationem. Voluptate quisquam iure assumenda consequatur ex et recusandae. Alias consectetur voluptatibus. Accusamus a ab dicta et. Consequatur quis dignissimos voluptatem nisi.',
  },
]
</script>
