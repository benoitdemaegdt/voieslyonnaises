/**
 * Ce script permet de récupérer les données d'un compteur vélo de lyon
 * https://data.eco-counter.com/ParcPublic/?id=3902#
 *
 * Un compteur est identifié par 2 ids : idPdc et flowIds
 *
 * required : NodeJS >= 18
 * run :
 * node ./scripts/fetchCounts.js
 * node ./scripts/fetchCounts.js > ./scripts/counts.json
 */

const URL = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/data/300018950?'
const idPdc = '300018950'
const flowIds = '353277144;353277145'

;(async () => {
  const counts = await getCounts()
  console.log(JSON.stringify({
    name: '',
    description: '',
    imageUrl: '',
    idPdc,
    flowIds,
    counts: formatCounts(counts)
  }, null, 2))
})()

async function getCounts () {
  const res = await fetch(URL + new URLSearchParams({
    idOrganisme: '3902',
    idPdc,
    flowIds,
    debut: '01/11/2022',
    fin: '31/12/2022',
    interval: '4' // month
  }))
  if (res.ok) {
    return res.json()
  } else {
    console.error('[getCounts] An error happened while fetching counts')
    process.exit(1)
  }
}

function formatCounts (counts) {
  return counts.map((count) => {
    const date = new Date(count[0])
    const year = date.toLocaleDateString('fr-FR', { year: 'numeric' })
    const month = date.toLocaleDateString('fr-FR', { month: '2-digit' })
    return {
      month: `${year}/${month}/01`,
      count: Number(count[1])
    }
  })
}
