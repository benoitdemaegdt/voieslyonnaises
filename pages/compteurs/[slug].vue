<template>
  <ContentFrame
    header="compteur vélo"
    :title="data.name"
    :description="data.description"
    :image-url="data.imageUrl"
  >
    <ChartTotalByYear :data="data" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" />
    <ChartTotalByMonth :data="data" class="mt-8 lg:p-4 lg:rounded-lg lg:shadow-md" />
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
