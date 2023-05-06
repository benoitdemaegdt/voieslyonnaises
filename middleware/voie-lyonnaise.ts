export default defineNuxtRouteMiddleware((to) => {
  const voieLyonnaiseRegex = /voie-lyonnaise-(1[0-2]|[1-9])\b/
  const isVoieLyonnaiseValid = voieLyonnaiseRegex.test(to.fullPath)
  if (!isVoieLyonnaiseValid) {
    return navigateTo('/404')
  }
})
