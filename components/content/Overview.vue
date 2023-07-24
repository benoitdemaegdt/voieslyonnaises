<template>
  <div>
    <div>
      <div class="space-y-6">
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
      <ClientOnly>
        <Map :features="features" style="height: 40vh" />
      </ClientOnly>
    </section>
  </div>
</template>

<script setup>
const { path } = useRoute()

const { voie } = defineProps({ voie: Object })

const { data: geojson } = await useAsyncData(`geojson-${path}`, () => {
  return queryContent('voies-lyonnaises')
    .where({ _type: 'json', _path: voie._path })
    .findOne()
})

const features = geojson.value.features

const avancement = Math.round(features
  .filter(feature => feature.properties.status === 'done')
  .map(feature => feature.properties.distance || 0)
  .reduce((acc, current) => acc + current, 0) * 100 / voie.distance)
</script>
