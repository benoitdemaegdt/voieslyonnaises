<template>
  <div ref="tweetContainer" v-bind="{tweetId}"></div>
</template>

<script setup>
const { tweetId } = defineProps({ tweetId: { type: String, required: true }, })
const tweetContainer = ref()

onMounted(() => renderTweet());

// https://github.com/DannyFeliz/vue-tweet/blob/main/src/components/vue-tweet.vue
function renderTweet() {
  if (!(window["twttr"] && window["twttr"].ready)) {
    addScript("https://platform.twitter.com/widgets.js", renderTweet);
    return;
  }
  window["twttr"]
    .ready()
    .then(({ widgets }) => {
      if (tweetContainer.value) {
        tweetContainer.value.innerHTML = "";
      }
      const { tweetId } = getTweetParams();
      widgets
        .createTweet(tweetId, tweetContainer.value)
        .then(async () => {
          await nextTick();
        })
      });
    }

function getTweetParams() {
  console.log('twwetId >>', tweetId)
  if (tweetId) {
    if (!/^\d+$/.test(tweetId)) {
      throw new Error('Invalid tweet-id')
    }
  } else {
    throw new Error('Must provide tweet-id')
  }
  return { tweetId }
}

function addScript(src, cb) {
  const s = document.createElement("script");
  s.setAttribute("src", src);
  s.addEventListener("load", () => cb(), false);
  document.body.appendChild(s);
}
</script>
