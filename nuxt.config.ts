import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  meta: {
    htmlAttrs: { lang: 'fr' },
    title: 'Voies Lyonnaises',
    meta: [
      { hid: 'description', name: 'description', content: 'avancement des voies lyonnaises' },
    ]
  },
  runtimeConfig: {
    public: {
      mapboxAccessToken: process.env.NUXT_MAPBOX_ACCESS_TOKEN,
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', 'nuxt-icon'],
  tailwindcss: { viewer: false },
  build: {
    transpile: ['@headlessui/vue'],
  },
})
