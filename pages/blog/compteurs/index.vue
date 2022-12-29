<template>
  <div>
    <div v-for="counter of counters" :key="counter.name" class="mt-4">
      <NuxtLink :to="counter._path">
        {{ counter.name }} {{ counter._path }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { data: counters } = await useAsyncData(() => {
  return queryContent('blog', 'compteurs').without('counts').find()
})
</script>
