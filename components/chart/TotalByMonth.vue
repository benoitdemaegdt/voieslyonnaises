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

const chartOptions = {
  title: { text: 'Total des passages par mois' },
  subtitle: { text: 'Source: data.eco-counter.com' },
  yAxis: { title: { text: 'Passages' } },
  xAxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Dec']
  },
  legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  series: [
    ...years.map(year => ({
      name: `${year}`,
      data: props.data.counts
        .filter(item => new Date(item.month).getFullYear() === year)
        .sort((a, b) => a.month - b.month)
        .map(item => item.count)
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
