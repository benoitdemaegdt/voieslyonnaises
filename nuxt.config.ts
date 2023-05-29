const TITLE = 'Cyclopolis - La plateforme de suivi des voies lyonnaises';
const DESCRIPTION =
  'Plateforme citoyenne et associative de suivi des voies lyonnaises. Actualité, cartes précises et à jour des itinéraires, travaux : suivez en temps réel le développement des pistes cyclables lyonnaises';
const BASE_URL = 'https://cyclopolis.fr';
const COVER_IMAGE_URL =
  'https://res.cloudinary.com/monpetitsommet/image/upload/v1663494829/voieslyonnaises/voies-lyonnaises_wkew1x.png';

export default defineNuxtConfig({
  app: {
    head: {
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
          content: DESCRIPTION
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
          content: DESCRIPTION
        },
        { hid: 'twitter:image', name: 'twitter:image', content: COVER_IMAGE_URL }
      ],
      script: [
        {
          src: 'https://beamanalytics.b-cdn.net/beam.min.js',
          'data-token': 'a2aab44b-048b-4696-9171-c8b470bc8ba5',
          async: true
        }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-icon'],
  content: {
    markdown: {
      tags: { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6' }
    }
  },
  tailwindcss: { viewer: false },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  },
  build: {
    transpile: ['@headlessui/vue']
  }
});
