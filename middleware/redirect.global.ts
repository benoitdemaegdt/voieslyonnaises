export default defineNuxtRouteMiddleware((to) => {
  // temporary redirect
  // before: /lignes/ligne-1
  // now: /voie-lyonnaise-1
  const oldPathRegex = /lignes\/ligne-(1[0-2]|[1-9])\b/
  const match = to.fullPath.match(oldPathRegex)
  if (match) {
    const voieLyonnaiseNumber = match[1]
    return navigateTo(`/voie-lyonnaise-${voieLyonnaiseNumber}`)
  }
})
