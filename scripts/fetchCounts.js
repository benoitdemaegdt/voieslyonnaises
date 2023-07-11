import { formatCounts } from './helpers.mjs';
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

const URL = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/data/300018950?';
const idPdc = '100030257';
const flowIds = '101030257;102030257';
const from = '01/01/2015';
const to = '31/01/2023';

(async () => {
  const counts = await getCounts();
  console.log(
    JSON.stringify(
      {
        name: '',
        description: '',
        arrondissement: '',
        imageUrl: '',
        idPdc,
        flowIds,
        counts: formatCounts(counts)
      },
      null,
      2
    )
  );
})();

async function getCounts() {
  const res = await fetch(
    URL +
      new URLSearchParams({
        idOrganisme: '3902',
        idPdc,
        flowIds,
        debut: from,
        fin: to,
        interval: '6' // month
      })
  );
  if (res.ok) {
    return res.json();
  } else {
    console.error('[getCounts] An error happened while fetching counts');
    process.exit(1);
  }
}
