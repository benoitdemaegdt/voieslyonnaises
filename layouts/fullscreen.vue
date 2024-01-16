<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <slot class="flex flex-grow" />
  </div>
</template>

<style scoped>
.h-screen {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(100dvh);
}
</style>
