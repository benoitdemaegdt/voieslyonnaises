import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon'],
  tailwindcss: { viewer: false },
  build: {
    transpile: ['@headlessui/vue'],
  },
})
