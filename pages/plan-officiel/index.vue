<template>
  <div class="w-full">
    <img
      src="~/assets/plan-officiel.png"
      class="object-contain w-full h-screen"
      alt="plan officiel des voies lyonnaises"
    >
  </div>
</template>

<script setup>
const description = 'Découvrez le plan officiel des Voies Lyonnaises, le futur réseau vélo lyonnais de 270km.'
const COVER_IMAGE_URL = 'https://res.cloudinary.com/monpetitsommet/image/upload/v1663494829/voieslyonnaises/voies-lyonnaises_wkew1x.png'
useHead({
  title: 'Plan officiel des Voies Lyonnaises',
  meta: [
    // description
    { hid: 'description', name: 'description', content: description },
    { hid: 'og:description', property: 'og:description', content: description },
    { hid: 'twitter:description', name: 'twitter:description', content: description },
    // cover image
    { hid: 'og:image', property: 'og:image', content: COVER_IMAGE_URL },
    { hid: 'twitter:image', name: 'twitter:image', content: COVER_IMAGE_URL }
  ]
})
</script>
