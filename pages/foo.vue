<template>
  <button @click="handleClick">
    click
  </button>
</template>

<script setup lang="ts">
async function handleClick() {
  const { data } = await useFetch('/content');
  console.log(data);
}
</script>
