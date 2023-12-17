<template>
  <ClientOnly>
    <highcharts :constructor-type="'ganttChart'" :options="chartOptions" />
  </ClientOnly>
</template>
<script setup>
const chartOptions = {
  title: {
    text: 'Calendrier des travaux de la Voie Lyonnaise n°1'
  },

  series: [{
    name: 'Voie Lyonnaise 1',
    data: [{
      name: 'Tronçon central',
      color: '#60A75B',
      start: Date.UTC(2022, 3, 1),
      end: Date.UTC(2024, 12, 31)
    }, {
      name: 'Tronçon Nord-Est',
      color: '#60A75B',
      start: Date.UTC(2025, 1, 1),
      end: Date.UTC(2025, 12, 31)
    }]
  }]
};
</script>
