<template>
  <div>
    <ClientOnly>
      <highcharts :options="chartOptions" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ data: { type: Object, required: true } })

const years = [...new Set(props.data.counts.map(item => new Date(item.month).getFullYear()))].sort()
const months = Array.from({ length: 12 }, (_, i) => i)

const chartOptions = {
  title: { text: 'Total des passages par mois' },
  credits: { enabled: false },
  yAxis: { title: { text: 'Passages' } },
  xAxis: {
    categories: months.map((month) => {
      const date = new Date(2022, month, 1)
      return date.toLocaleDateString('fr-FR', { month: 'short' })
    })
  },
  legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  series: [
    ...years.map(year => ({
      name: `${year}`,
      data: months.map((month) => {
        return props.data.counts
          .filter((item) => {
            const date = new Date(item.month)
            return date.getFullYear() === year && date.getMonth() === month
          })
          .map(item => item.count)
      })
    }))
  ],
  responsive: {
    rules: [
      {
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }
    ]
  }
}
</script>
