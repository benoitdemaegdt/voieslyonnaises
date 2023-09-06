<template>
  <div>
    <div class="max-w-2xl mx-auto bg-gray-200 rounded-full">
      <div class="bg-lvv-blue-600 text-xs font-medium text-white text-center p-1 leading-none rounded-full" :style="`width: ${percent}%`">
        {{ percent }}%
      </div>
    </div>
  </div>
</template>

<script setup>
const { voies } = defineProps({
  voies: { type: Array, required: true }
})

const allSections = voies
  .map(voie => voie.features)
  .flat()
  .filter((feature) => {
    return feature.geometry.type === 'LineString' &&
      feature.properties.status !== 'postponed'
  })

// Not sure we want to compute it as it takes into account several same variants
// const totalDistance = allSections.reduce((acc, section) => {
//   if (!section.properties.distance) {
//     console.log('section >>', section)
//     return acc
//   }
//   return acc + section.properties.distance
// }, 0)
const totalDistance = 250_000

const doneDistance = allSections
  .filter((feature) => {
    return feature.properties.status === 'done'
  })
  .reduce((acc, section) => {
    if (!section.properties.distance) {
      console.log('section >>', section)
      return acc
    }
    return acc + section.properties.distance
  }, 0)

const percent = Math.round(doneDistance * 100 / totalDistance)
</script>
