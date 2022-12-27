<template>
  <footer class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
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
        &copy; 2022 Voies Lyonnaises.
      </p>
    </div>
  </footer>
</template>

<script setup>
const navigation = {
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
</script>
