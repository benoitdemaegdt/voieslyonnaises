/**
 * Ce script permet de récupérer les données des compteurs vélo de lyon
 * https://data.eco-counter.com/ParcPublic/?id=3902#
 *
 * required : NodeJS >= 18
 * run : node ./scripts/fetchCounters.js > ./scripts/counters.json
 */

const URL = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/3902?withNull=true'

;(async () => {
  const counters = await getAllCounters()
  console.log(JSON.stringify(formatCounters(counters), null, 2))
})()

async function getAllCounters () {
  const res = await fetch(URL)
  if (res.ok) {
    return res.json()
  }
  console.error('[getAllCounters] An error happened while fetching counters')
  process.exit(1)
}

function formatCounters (counters) {
  return counters.map(counter => ({
    name: counter.nom,
    idPdc: counter.idPdc,
    flowIds: counter.pratique.map(item => item.id).join(';'),
    lat: counter.lat,
    long: counter.lon
  }))
}
