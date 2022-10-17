const TITLE = 'Voies Lyonnaises'
const DESCRIPTION = 'Avancement des voies lyonnaises'
const BASE_URL = 'https://voieslyonnaises.netlify.app'
const COVER_IMAGE_URL = 'https://res.cloudinary.com/monpetitsommet/image/upload/v1663494829/voieslyonnaises/voies-lyonnaises_wkew1x.png'

export default defineNuxtConfig({
  meta: {
    htmlAttrs: { lang: 'fr' },
    title: TITLE,
    meta: [
      { hid: 'description', name: 'description', content: DESCRIPTION },
      // facebook
      { property: 'og:site_name', content: TITLE },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: BASE_URL },
      { hid: 'og:title', property: 'og:title', content: TITLE },
      {
        hid: 'og:description',
        property: 'og:description',
        content: DESCRIPTION,
      },
      { hid: 'og:image', property: 'og:image', content: COVER_IMAGE_URL },
      { property: 'og:image:width', content: '640' },
      { property: 'og:image:height', content: '476' },
      // twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:url', name: 'twitter:url', content: BASE_URL },
      { hid: 'twitter:title', name: 'twitter:title', content: TITLE },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: DESCRIPTION,
      },
      { hid: 'twitter:image', name: 'twitter:image', content: COVER_IMAGE_URL },
    ]
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-icon'],
  tailwindcss: { viewer: false },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },
  build: {
    transpile: ['@headlessui/vue'],
  },
})
