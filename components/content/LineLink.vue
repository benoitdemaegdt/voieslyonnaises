<template>
  <a :href="`/voie-lyonnaise-${voie.line}`" :style="`color: ${voie.color}; text-decoration-color: ${voie.color};`">
    Voie Lyonnaise
    <span
      class="h-6 w-6 rounded-full inline-flex items-center justify-center text-white"
      :style="`background-color: ${voie.color};`"
    >
      {{ voie.line }}
    </span>
  </a>
</template>

<script setup>
const props = defineProps({
  line: { type: String, required: true }
})

const { data: voie } = await useAsyncData(props.line, () => {
  return queryContent('voies-lyonnaises').where({ _type: 'markdown', line: Number(props.line) }).findOne()
})
</script>
