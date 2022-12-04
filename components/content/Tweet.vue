<template>
  <Tweet :tweet-id="tweetId" />
</template>

<script setup>
import Tweet from "vue-tweet";
defineProps({
  tweetId: { type: String, required: true },
})
</script>
