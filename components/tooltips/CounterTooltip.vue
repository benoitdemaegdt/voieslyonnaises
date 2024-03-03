<template>
  <div class="not-prose w-48">
    <div class="py-1 bg-lvv-blue-600 flex flex-col items-center justify-center text-white">
      <div class="font-bold text-base hover:underline">
        <a :href="feature.properties.link">
          {{ feature.properties.name }}
        </a>
      </div>
      <div>Compteur vélo</div>
    </div>
    <div class="divide-y">
      <div class="py-1 flex items-center justify-around bg-zinc-100">
        <div class="text-base text-black w-8">
          <Icon v-if="!count.isFirstMonth" name="mdi:chevron-left" class="cursor-pointer" @click="changeMonth(-1)" />
        </div>
        <div class="text-base text-black">
          {{ count.humanDate }}
        </div>
        <div class="text-base text-black w-8">
          <Icon v-if="!count.isLastMonth" name="mdi:chevron-right" class="cursor-pointer" @click="changeMonth(+1)" />
        </div>
      </div>
      <div class="py-1 flex items-center justify-center text-black">
        <div class="text-base font-bold">
          {{ count.averageDailyTraffic }}
        </div>
        <div class="px-2 text-3xl">
          <Icon name="game-icons:dutch-bike" />
        </div>
        <div class="text-left leading-3">
          <div class="font-bold">
            par jour
          </div>
          <div>en moyenne</div>
        </div>
      </div>
      <div v-if="count.isAbsoluteBest">
        <div class="my-2 mx-8 bg-lvv-pink text-sm text-white font-semibold rounded-xl px-1.5 border-black border-2">
          record absolu
        </div>
      </div>
      <div v-if="count.isMonthBest && !count.isAbsoluteBest">
        <div class="my-2 mx-8 bg-lvv-pink text-sm text-white font-semibold rounded-xl px-1.5 border-white border-2">
          record mensuel
        </div>
      </div>
      <div v-if="!count.isMonthBest && !count.isAbsoluteBest">
        <div class="my-2 mx-8 text-sm text-white font-semibold rounded-xl px-1.5 border-white border-2">
          aucun record
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Count = {
  month: string
  count: number
  humanDate: string
  averageDailyTraffic: number
  // handle previous / next arrows
  isFirstMonth: boolean
  isLastMonth: boolean
  isMonthBest: boolean
  isAbsoluteBest: boolean
}

type Properties = {
  type: 'compteur'
  name: string
  link: string
  /**
   * Stringified Count[]
   */
  counts: string
}

const { feature } = defineProps<{
  feature: {
    type: string;
    properties: Properties;
    geometry: {
      type: string;
      coordinates: number[][];
    };
  },
}>();

const counts = JSON.parse(feature.properties.counts) as Count[];
const countIndex = ref(counts.length - 1);

const count = computed(() => counts.at(countIndex.value)!);

const changeMonth = (offset: number) => {
  countIndex.value += offset;
};
</script>
