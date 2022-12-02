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
</script>
