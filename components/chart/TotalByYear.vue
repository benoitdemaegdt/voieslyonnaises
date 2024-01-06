<template>
  <div>
    <ClientOnly>
      <highcharts :options="chartOptions" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({ data: { type: Object, required: true } });

type Count = { month: string, count: number };
const years = [...new Set(props.data.counts.map((item: Count) => new Date(item.month).getFullYear()))].sort();
const countsValues = years.map((year) => {
  return props.data.counts
    .filter((item: Count) => new Date(item.month).getFullYear() === year)
    .reduce((acc: number, item: Count) => acc + item.count, 0);
});
const max = Math.max(...countsValues);

const chartOptions = {
  chart: { type: 'column' },
  title: { text: `Fréquentation cycliste annuelle - ${props.data.name}` },
  credits: { enabled: false },
  legend: { enabled: false },
  xAxis: { categories: years },
  yAxis: { min: 0, title: { text: 'Passages' } },
  plotOptions: {
    column: { pointPadding: 0.2, borderWidth: 0 },
    series: {
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [{
    name: 'passages',
    data: countsValues.map(y => {
      const color = y === max ? '#C84271' : '#152B68';
      return { y, color, dataLabels: { color } };
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
};
</script>
