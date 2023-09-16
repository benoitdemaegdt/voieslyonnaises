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
const { voies } = defineProps({
  voies: { type: Array, required: true }
})

// TODO: should compute uniqness of shared lines
const allSections = voies
  .map(voie => voie.features)
  .flat()
  .filter(feature => feature.geometry.type === 'LineString')

function getDistance ({ status }) {
  const distanceInMeters = allSections
    .filter(feature => feature.properties.status === status)
    .reduce((acc, section) => {
      if (!section.properties.distance) {
        console.log('section >>', section)
        return acc
      }
      return acc + section.properties.distance
    }, 0)

  return Math.round(distanceInMeters / 1000)
}

const done = getDistance({ status: 'done' })
const wip = getDistance({ status: 'wip' })
const planned = getDistance({ status: 'planned' })
const postponed = getDistance({ status: 'postponed' })

// TODO: should compute percent
const stats = [
  { name: 'Réalisés', distance: `${done} km`, percent: '2.7%' },
  { name: 'En travaux', distance: `${wip} km`, percent: '1.8%' },
  { name: 'Prévus', distance: `${planned} km`, percent: '81.6%' },
  { name: 'Reportés', distance: `${postponed} km`, percent: '10.3%' }
]
</script>
