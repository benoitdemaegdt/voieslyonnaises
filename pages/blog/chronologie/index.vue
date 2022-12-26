<template>
  <ContentFrame
  header="Aménagements cyclables"
  title="Historique des aménagements cyclables à Lyon"
  :description="DESCRIPTION"
  :imageUrl="IMAGE_URL"
>
<div class="py-4 mx-auto not-prose">
  <ol class="relative border-l border-gray-200">
    <li class="mb-10 ml-4" v-for="article in articles">
        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-2 -left-1.5 border border-white"></div>
        <h3 class="text-lg font-semibold text-gray-800 capitalize">{{ getDateText(article.date) }}</h3>
        <p class="mb-4 mt-1 text-base font-normal text-gray-500 ">{{ article.description }}</p>
        <NuxtLink :to="article._path" class="inline-flex items-center py-2 px-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:text-official focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-official">Détails <svg class="ml-2 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></NuxtLink>
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

const DESCRIPTION = "Travaux en cours, nouveaux projets, végétalisation, réflexions : retrouvez mois après mois l'historique des aménagements cyclables et des voies Lyonnaises."
const IMAGE_URL = 'https://source.unsplash.com/KQJpAe6UabU'
useHead({
  meta: [
    // description
    { hid: 'description', name: 'description', content: DESCRIPTION },
    { hid: 'og:description', property: 'og:description', content: DESCRIPTION },
    { hid: 'twitter:description', name: 'twitter:description', content: DESCRIPTION },
    // cover image
    { hid: 'og:image', property: 'og:image', content: IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: IMAGE_URL },
  ],
})
</script>
