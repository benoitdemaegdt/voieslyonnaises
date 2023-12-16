/**
 * Ce script permet de maj les données des compteurs vélo suivis
 * https://data.eco-counter.com/ParcPublic/?id=3902#
 *
 * required : NodeJS >= 18
 * run : node ./.github/scripts/update-counters.js
 */
const fs = require('fs');
const path = require('path');

(async () => {
  const allCounters = await getAllCounters();
  const trackedCounters = getTrackedCounters();
  for (const { file, counter } of trackedCounters) {
    console.log(`<<<<<<< ${counter.name} >>>>>>>`);
    const flowIds = allCounters.find(c => c.idPdc === counter.idPdc).flowIds;
    const updatedCounts = await getUpdatedCounts({ idPdc: counter.idPdc, flowIds });
    updateFile({ file, counter: { ...counter, counts: updatedCounts } });
  }

  if (allCounters.length !== trackedCounters.length) {
    console.log(`\n${allCounters.length - trackedCounters.length} counters not tracked yet:`);
    for (const counter of allCounters) {
      if (!trackedCounters.find(c => c.counter.idPdc === counter.idPdc)) {
        console.log(counter.name);
      }
    }
  }
})();

async function getAllCounters() {
  /**
   * The `pratiques` query parameter is a comma separated list of the following optional integers:
   * - 1 marche
   * - 2 vélo
   * - 13 trottinette
   */
  const URL = 'https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/3902?withNull=true&pratiques=2';
  const res = await fetch(URL);
  if (res.ok) {
    const allCounters = await res.json();
    return allCounters.map(counter => ({
      name: counter.nom,
      idPdc: counter.idPdc,
      flowIds: counter.pratique.map(item => item.id).join(';')
    }));
  } else {
    console.error('[getAllCounters] An error happened while fetching counters');
    process.exit(1);
  }
}
function getTrackedCounters() {
  const files = fs.readdirSync('content/compteurs');
  return files.map(file => {
    const filePath = path.join('content/compteurs', file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      file,
      counter: data
    };
  });
}

async function getUpdatedCounts({ idPdc, flowIds }) {
  const URL = `https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/data/${idPdc}?`;
  const res = await fetch(
    URL +
      new URLSearchParams({
        idOrganisme: '3902',
        idPdc,
        flowIds,
        // debut: getFirstDayOfYear(),
        debut: '01/01/2015',
        fin: getFirstDayOfCurrentMonth(),
        interval: '6' // month
      })
  );
  if (res.ok) {
    const counts = await res.json();
    return counts.map(count => {
      const date = new Date(count[0]);
      const year = date.toLocaleDateString('fr-FR', { year: 'numeric' });
      const month = date.toLocaleDateString('fr-FR', { month: '2-digit' });
      return {
        month: `${year}/${month}/01`,
        count: Number(count[1])
      };
    });
  } else {
    console.error('[getUpdatedCounts] An error happened while fetching counts', res);
    process.exit(1);
  }
}

function updateFile({ file, counter }) {
  const filePath = path.join('content/compteurs', file);
  fs.writeFileSync(filePath, JSON.stringify(counter, null, 2));
}

/**
 * HELPER FUNCTIONS
 */
function getFirstDayOfYear() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  // Format the date as "dd/mm/yyyy"
  return `01/01/${year}`;
}

function getFirstDayOfCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create a new date object with the year and month, set day to 1
  const firstDayOfMonth = new Date(year, month, 1);

  // Format the date as "dd/mm/yyyy"
  return (
    firstDayOfMonth.getDate().toString().padStart(2, '0') +
    '/' +
    (firstDayOfMonth.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    firstDayOfMonth.getFullYear()
  );
}
