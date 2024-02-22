<template>
  <button @click="handleClick">
    click
  </button>
</template>

<script setup lang="ts">
async function handleClick() {
  const contents = await $fetch('/api/_content/query');
  console.log(contents);
}
</script>
