<template>
  <ContentFrame
    header="chronologie"
    :title="getDateText(article.date).toUpperCase()"
    :description="article.description"
    :imageUrl="article.imageUrl"
  >
  <div class="not-prose">
    <ol class="relative border-l border-gray-200">
      <li class="mb-8 ml-4" v-for="event of article.events">
        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
        <h3 class="text-lg font-semibold text-gray-800">{{ getDayAndMonth(event.date) }}</h3>
        <div v-for="news of event.news" :key="news.title" class="mt-4 first:mt-2 p-2 rounded-lg hover:bg-gray-50">
          <NuxtLink :to="news.tweet" target="_blank">
            <h4>{{ news.title }}</h4>
            <div class="text-official">
              <span class="text-base">{{ news.link }}</span>
              <Icon name="mdi:chevron-right" class="h-5 w-5" aria-hidden="true"></Icon>
            </div>
          </NuxtLink>
        </div>
      </li>
    </ol>
  </div>
  </ContentFrame>
</template>

<script setup>
const { path } = useRoute()
const { withoutTrailingSlash } = useUrl()
const { getDateText, getDayAndMonth } = useDate()

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
