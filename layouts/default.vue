<template>
  <div>
    <NewsBanner v-if="!isNewsBannerClosed" />
    <AppHeader class="sticky top-0" />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup>
const isNewsBannerClosed = localStorage.getItem('isNewsBannerClosed') === 'true';
</script>
