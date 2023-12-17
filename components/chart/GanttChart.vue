<template>
  <ClientOnly>
    <highcharts :constructor-type="'ganttChart'" :options="chartOptions" />
  </ClientOnly>
</template>
<script setup>
const chartOptions = {
  title: {
    text: 'Calendrier des travaux des Voies Lyonnaises'
  },
  // xAxis: [{
  //   grid: { // default setting
  //     enabled: true
  //   },
  //   tickInterval: 1000 * 60 * 60 * 24 * 7 // week
  // }],

  series: [{
    name: 'Voies Lyonnaises',
    data: [
      {
        name: 'Voie Lyonnaise n°1',
        id: 'voie-lyonnaise-1',
        pointWidth: 0
      },
      {
        name: 'Tronçon central',
        parent: 'voie-lyonnaise-1',
        color: '#60A75B',
        start: Date.UTC(2022, 3, 1),
        end: Date.UTC(2024, 12, 31)
      }, {
        name: 'Tronçon Nord-Est',
        parent: 'voie-lyonnaise-1',
        color: '#60A75B',
        start: Date.UTC(2025, 1, 1),
        end: Date.UTC(2025, 12, 31)
      },
      {
        name: 'Voie Lyonnaise n°2',
        id: 'voie-lyonnaise-2',
        pointWidth: 0
      }, {
        name: 'Tronçon central',
        parent: 'voie-lyonnaise-2',
        color: '#AC4D35',
        start: Date.UTC(2023, 3, 1),
        end: Date.UTC(2024, 6, 1)
      },
      {
        name: 'Tronçon sud',
        parent: 'voie-lyonnaise-2',
        color: '#AC4D35',
        start: Date.UTC(2023, 10, 1),
        end: Date.UTC(2025, 12, 31)
      }]
  }]
};
</script>
