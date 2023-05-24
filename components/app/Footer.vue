<template>
  <footer class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
        <div v-for="item in navigation.main" :key="item.name" class="px-5 py-2">
          <NuxtLink :to="item.path" class="text-base text-gray-500 hover:text-gray-900">
            {{ item.name }}
          </NuxtLink>
        </div>
      </nav>
      <div class="mt-8 flex justify-center space-x-6">
        <a
          v-for="item in navigation.social"
          :key="item.name"
          :href="item.href"
          target="_blank"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ item.name }}</span>
          <Icon :name="item.icon" class="h-6 w-6" aria-hidden="true" />
        </a>
      </div>
      <p class="mt-8 text-center text-base text-gray-400">
        &copy; {{ year }} Cyclopolis
      </p>
    </div>
  </footer>
</template>

<script setup>
const navigation = {
  main: [
    { name: 'Mentions légales', path: '/mentions-legales' }
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/benoit_demaegdt',
      icon: 'mdi:twitter'
    },
    {
      name: 'Github',
      href: 'https://github.com/benoitdemaegdt/voieslyonnaises',
      icon: 'mdi:github'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/benoitdemaegdt',
      icon: 'mdi:linkedin'
    }
  ]
}

const year = new Date().getFullYear()
</script>
