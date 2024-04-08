/**
 * Ce script permet de maj les données des compteurs voiture suivis
 * https://avatar.cerema.fr/api/doc
 *
 * required : NodeJS >= 18
 * run : node ./.github/scripts/update-voiture-counters.js
 */
const fs = require('fs');
const path = require('path');

(async () => {
  const trackedCounters = getTrackedCounters();
  for (const { file, counter } of trackedCounters) {
    console.log(`<<<<<<< ${counter.name} >>>>>>>`);
    const counts = await getCompteurData({ idPdc: counter.idPdc });
    updateFile({ file, counter: { ...counter, counts } });
  }
})();

/**
 * Suite aux échanges avec le Cerema, utilisation de l'API aggregated_measures.
 * Elle retourne le volume moyen quotidien sur le mois concené.
 * Pour avoir le volume total mensuel, on multiplie par le nbr de jours dans le mois.
 */
async function getCompteurData({ idPdc }) {
  const startTime = '2018-01-01T00:00:00';
  const endTime = getLastDayOfPreviousMonth();
  const params = new URLSearchParams({
    count_point_ids: idPdc,
    start_time: startTime,
    end_time: endTime,
    time_zone: 'Europe/Paris',
    aggregation_period: 'month',
    limit: 1000 // default 10
  });
  const URL = 'https://avatar.cerema.fr/api/aggregated_measures/?' + params.toString();
  const res = await fetch(URL);
  if (res.ok) {
    const countPoints = await res.json();
    return countPoints.map(countPoint => {
      const daysInMonth = getDaysInMonth(countPoint.dt);
      return {
        month: countPoint.dt.slice(0, 10),
        count: Math.round(countPoint.q * daysInMonth)
      };
    });
  } else {
    console.log(res.statusText);
    console.error('[getCompteurData] An error happened while fetching counter data');
    process.exit(1);
  }
}

/**
 * Github action runs every 1st day of each month.
 * So it should fetch data until last day of previous month as we only look at monthly data.
 */
function getLastDayOfPreviousMonth() {
  const lastDayOfPreviousMonth = new Date().setDate(0);
  return `${new Date(lastDayOfPreviousMonth).toISOString().slice(0, 10)}T23:59:59`;
}

/**
 * isostring en input
 * ex: 2024-01-01T00:00:00+01:00 => 31
 */
function getDaysInMonth(date) {
  const [year, month] = date.split('-');
  return new Date(year, month, 0).getDate();
}

function getTrackedCounters() {
  const files = fs.readdirSync('content/compteurs/voiture');
  return files.map(file => {
    const filePath = path.join('content/compteurs/voiture', file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      file,
      counter: data
    };
  });
}

function updateFile({ file, counter }) {
  const filePath = path.join('content/compteurs/voiture', file);
  fs.writeFileSync(filePath, JSON.stringify(counter, null, 2));
}
