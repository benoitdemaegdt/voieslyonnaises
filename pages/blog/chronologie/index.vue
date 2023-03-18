<template>
  <ContentFrame
    header="Aménagements cyclables"
    title="Historique des aménagements cyclables à Lyon"
    :description="DESCRIPTION"
    :image-url="IMAGE_URL"
  >
    <div class="py-4 mx-auto not-prose">
      <ol class="relative border-l border-gray-200">
        <li v-for="article in articles" class="mb-10 ml-4">
          <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white" />
          <h3 class="text-lg font-semibold text-gray-800 capitalize">
            {{ getDateText(article.date) }}
          </h3>
          <div class="rounded-lg hover:bg-gray-50 p-2 mt-2">
            <NuxtLink :to="article._path">
              <h4>{{ article.description }}</h4>
              <div class="text-official">
                <span class="text-base">détails</span>
                <Icon name="mdi:chevron-right" class="h-5 w-5" aria-hidden="true" />
              </div>
            </NuxtLink>
          </div>
        </li>
      </ol>
    </div>
  </ContentFrame>
</template>

<script setup>
const { getDateText } = useDate()

const { data: articles } = await useAsyncData(() => {
  return queryContent('blog', 'chronologie').sort({ date: -1 }).find()
})

const DESCRIPTION =
  "Travaux en cours, nouveaux projets, végétalisation, réflexions : retrouvez mois après mois l'historique des aménagements cyclables et des voies Lyonnaises."
const IMAGE_URL = 'https://source.unsplash.com/KQJpAe6UabU'
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: DESCRIPTION },
    { hid: 'og:description', property: 'og:description', content: DESCRIPTION },
    { hid: 'twitter:description', name: 'twitter:description', content: DESCRIPTION },
    // cover image
    { hid: 'og:image', property: 'og:image', content: IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: IMAGE_URL }
  ]
})
</script>
