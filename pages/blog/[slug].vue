<template>
  <ContentFrame
    header="Article"
    :title="article.title"
    :description="article.description"
    :imageUrl="article.imageUrl"
  >
    <ContentRenderer :value="article" />
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()
const { withoutTrailingSlash } = useUrl()

const { data: article } = await useAsyncData(`article-${path}`, () => {
  return queryContent()
    .where({ _path: withoutTrailingSlash(path) })
    .findOne()
})

useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: article.value.description },
    { hid: 'og:description', property: 'og:description', content: article.value.description },
    { hid: 'twitter:description', name: 'twitter:description', content: article.value.description },
    // cover image
    { hid: 'og:image', property: 'og:image', content: article.value.imageUrl },
    { hid: 'twitter:image', name: 'twitter:image', content: article.value.imageUrl },
  ],
})
</script>
