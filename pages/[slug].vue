
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
                        <div class="h-20 w-20 rounded-full flex items-center justify-center bg-ligne1 text-white text-3xl font-bold">1</div>
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

            <!-- Actions panel -->
            <section aria-labelledby="quick-links-title">
              <div class="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                <h2 class="sr-only" id="quick-links-title">Quick links</h2>
                <div v-for="(action, actionIdx) in actions" :key="action.name" :class="[actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '', actionIdx === 1 ? 'sm:rounded-tr-lg' : '', actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '', actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '', 'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-500']">
                  <div>
                    <span :class="[action.iconBackground, action.iconForeground, 'rounded-lg inline-flex p-3 ring-4 ring-white']">
                      <!-- <component :is="action.icon" class="h-6 w-6" aria-hidden="true" /> -->
                      <Icon name="mdi:bike" class="h-6 w-6" aria-hidden="true"></Icon>
                    </span>
                  </div>
                  <div class="mt-8">
                    <h3 class="text-lg font-medium">
                      <a :href="action.href" class="focus:outline-none">
                        <!-- Extend touch target to entire panel -->
                        <span class="absolute inset-0" aria-hidden="true" />
                        {{ action.name }}
                      </a>
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.</p>
                  </div>
                  <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </div>
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
                    <a href="#" class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> View all </a>
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
                                :class="voie.color"
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
                            <NuxtLink :to="voie.path" class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"> View </NuxtLink>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-6">
                    <a href="#" class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> View all </a>
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

const voie = {
  line: '1',
  from: 'Vaulx-en-Velin',
  to: 'Saint-Fons',
  distance: '21km',
  trafic: '28 000 vélos / jour',
  status: 'Travaux en cours'
}

const actions = [
  { icon: '', name: 'Request time off', href: '#', iconForeground: 'text-teal-700', iconBackground: 'bg-teal-50' },
  { icon: '', name: 'Benefits', href: '#', iconForeground: 'text-purple-700', iconBackground: 'bg-purple-50' },
  { icon: '', name: 'Schedule a one-on-one', href: '#', iconForeground: 'text-sky-700', iconBackground: 'bg-sky-50' },
  { icon: '', name: 'Payroll', href: '#', iconForeground: 'text-yellow-700', iconBackground: 'bg-yellow-50' },
  { icon: '', name: 'Submit an expense', href: '#', iconForeground: 'text-rose-700', iconBackground: 'bg-rose-50' },
  { icon: '', name: 'Training', href: '#', iconForeground: 'text-indigo-700', iconBackground: 'bg-indigo-50' },
]

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

const otherLines = [
  { line: '2', path: '/ligne-2', color: 'bg-ligne2', from: 'Cailloux', to: 'Mions' },
  { line: '3', path: '/ligne-3', color: 'bg-ligne3', from: 'Quincieux', to: 'Givors' },
  { line: '4', path: '/ligne-4', color: 'bg-ligne4', from: 'Lissieu', to: 'Villeurbanne' },
  { line: '5', path: '/ligne-5', color: 'bg-ligne5', from: 'Saint-Fons', to: 'Bron' },
]
</script>
