<template>
  <ContentFrame
    header="compteur vélo"
    :title="data.name"
    :description="data.description"
    :image-url="data.imageUrl"
  >
    <ClientOnly>
      <highcharts :options="chartOptions" />
    </ClientOnly>
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()
const { withoutTrailingSlash } = useUrl()

const { data } = await useAsyncData(`compteur-${path}`, () => {
  return queryContent()
    .where({ _path: withoutTrailingSlash(path) })
    .findOne()
})

const years = [...new Set(data.value.counts.map(item => new Date(item.month).getFullYear()))].sort()

const chartOptions = {
  title: { text: `Cumul des passages ${data.value.name}` },
  yAxis: { title: { text: 'Cumuls' } },
  xAxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Dec']
  },
  legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
  series: [
    ...years.map(year => ({
      name: `${year}`,
      data: data.value.counts
        .filter(item => new Date(item.month).getFullYear() === year)
        .sort((a, b) => a.month - b.month)
        .map((sum => item => sum = Math.round((sum + item.count) * 10) / 10)(0))
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

const DESCRIPTION = `Compteur vélo ${data.value.name}`
const IMAGE_URL = data.value.imageUrl
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: DESCRIPTION },
    { hid: 'og:description', property: 'og:description', DESCRIPTION },
    { hid: 'twitter:description', name: 'twitter:description', DESCRIPTION },
    // cover image
    { hid: 'og:image', property: 'og:image', content: IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: IMAGE_URL }
  ]
})
</script>
