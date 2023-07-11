<template>
  <div>
    <ClientOnly>
      <highcharts :options="chartOptions" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
interface CompteurContent extends ParsedContent {
  counts: Array<{month: string, count: number}>
}

const { month, compteurName } = defineProps({
  month: { type: String, required: true },
  compteurName: { type: String, required: true }
})

const { data } = await useAsyncData(`compteur-${compteurName}`, () => {
  return queryContent<CompteurContent>('compteurs')
    .where({ name: compteurName })
    .findOne()
})

const counts = data.value?.counts.filter((count) => {
  const date = new Date(count.month)
  return date.toLocaleString('fr-Fr', { month: 'long' }) === month
}).sort((count1, count2) => count1.month - count2.month)

const months = counts?.map(count => new Date(count.month).toLocaleString('fr-Fr', { month: 'long', year: 'numeric' }))

const chartOptions = {
  chart: {
    height: 500,
    type: 'column'
  },
  title: { text: `Fréquentation les mois de ${month}` },
  subtitle: { text: `Compteur: ${compteurName}` },
  xAxis: { categories: months },
  yAxis: { min: 0, title: { text: 'Fréquentation' } },
  plotOptions: {
    column: { pointPadding: 0.2, borderWidth: 0 },
    series: {
      dataLabels: {
        enabled: true,
        style: {
          color: '#64748b'
        }
      }
    }
  },
  series: [{
    name: 'fréquentation',
    data: counts?.map(count => count.count)
  }]
}
</script>
