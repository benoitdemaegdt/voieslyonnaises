<template>
  <div>
    <div class="mt-5 grid grid-cols-2 rounded-lg bg-white overflow-hidden shadow divide-y divide-x divide-gray-200 md:divide-y-0 md:grid-cols-4 ">
      <div v-for="item in stats" :key="item.name" class="px-4 py-5 sm:p-6">
        <div class="flex justify-between">
          <div class="text-base font-normal text-gray-900">
            {{ item.name }}
          </div>
          <div class="text-sm font-semibold text-lvv-blue-600">
            {{ item.percent }}
          </div>
        </div>
        <div class="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div class="flex items-baseline text-2xl font-semibold text-lvv-blue-600">
            {{ item.distance }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getAllUniqSections, getDistance } = useStats()

const { voies } = defineProps({
  voies: { type: Array, required: true }
})

const allSections = getAllUniqSections(voies)

const total = getDistance({ allSections, status: ['done', 'wip', 'planned', 'postponed', 'unknown', 'variante', 'variante-postponed'] })
const done = {
  distance: getDistance({ allSections, status: ['done'] }),
  percent: Math.round(getDistance({ allSections, status: ['done'] }) / total * 100)
}
const wip = {
  distance: getDistance({ allSections, status: ['wip'] }),
  percent: Math.round(getDistance({ allSections, status: ['wip'] }) / total * 100)
}
const planned = {
  distance: getDistance({ allSections, status: ['planned', 'unknown', 'variante'] }),
  percent: Math.round(getDistance({ allSections, status: ['planned', 'unknown', 'variante'] }) / total * 100)
}
const postponed = {
  distance: getDistance({ allSections, status: ['postponed', 'variante-postponed'] }),
  percent: Math.round(getDistance({ allSections, status: ['postponed', 'variante-postponed'] }) / total * 100)
}

const stats = [
  { name: 'Réalisés', distance: `${done.distance} km`, percent: `${done.percent}%` },
  { name: 'En travaux', distance: `${wip.distance} km`, percent: `${wip.percent}%` },
  { name: 'Prévus', distance: `${planned.distance} km`, percent: `${planned.percent}%` },
  { name: 'Reportés', distance: `${postponed.distance} km`, percent: `${postponed.percent}%` }
]
</script>
