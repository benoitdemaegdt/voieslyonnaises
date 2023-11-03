<template>
  <div>
    <NewsBanner v-if="!isNewsBannerClosed" @close="closeNewsBanner" />
    <AppHeader class="sticky top-0" />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup>
const isNewsBannerClosed = ref(false);

onMounted(() => {
  isNewsBannerClosed.value = localStorage.getItem('isNewsBannerClosed') === 'true';
});

function closeNewsBanner() {
  isNewsBannerClosed.value = true;
  localStorage.setItem('isNewsBannerClosed', 'true');
}
</script>
