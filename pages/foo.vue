<template>
  <h1>foo</h1>
</template>

<script setup lang="ts">
const { data } = await useFetch('/content');
console.log(data);
</script>
