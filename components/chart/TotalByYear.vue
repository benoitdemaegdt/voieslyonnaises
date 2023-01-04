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
  chart: { type: 'column' },
  title: { text: 'Total des passages par année' },
  credits: { enabled: false },
  xAxis: { categories: years },
  yAxis: { min: 0, title: { text: 'Passages' } },
  legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  plotOptions: {
    column: { pointPadding: 0.2, borderWidth: 0 }
  },
  series: [{
    name: 'passages',
    data: years.map((year) => {
      return props.data.counts
        .filter(item => new Date(item.month).getFullYear() === year)
        .reduce((acc, item) => acc + item.count, 0)
    })
  }],
  responsive: {
    rules: [
      {
        condition: { maxWidth: 500 },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          yAxis: { title: { text: undefined } }
        }
      }
    ]
  }
}
</script>
