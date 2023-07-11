import fs from 'fs';
import path from 'path';
import { formatCounts } from './helpers.js';

/**
 * Ce script permet de maj les données des compteurs vélo suivis
 * https://data.eco-counter.com/ParcPublic/?id=3902#
 *
 * required : NodeJS >= 18
 * run : node ./scripts/updateCounters.js
 */

const directoryPath = './content/compteurs';

(async () => {
  const counters = getCounters();
  for (const counter of counters) {
    console.log(' ');
    console.log(`<<<<<<< ${counter.name} >>>>>>>`);
    const newCounts = await getCounts(counter.idPdc, counter.flowIds);
    const counts = mergeCounts({ currentCounts: counter.counts, newCounts });
    updateCounter({ file: counter.file, counter: { ...counter, counts } });
  }
  // console.log(JSON.stringify(formatCounters(counters), null, 2));
})();

// Get all tracked counters.
function getCounters() {
  const files = fs.readdirSync(directoryPath);
  return files.map(file => {
    const filePath = path.join(directoryPath, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      file,
      name: data.name,
      idPdc: data.idPdc,
      flowIds: data.flowIds,
      counts: data.counts
    };
  });
}

async function getCounts(idPdc, flowIds) {
  const URL = `https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/data/${idPdc}?`;
  const res = await fetch(
    URL +
      new URLSearchParams({
        idOrganisme: '3902',
        idPdc,
        flowIds,
        debut: getFirstDayOfYear(),
        fin: getFirstDayOfCurrentMonth(),
        interval: '6' // month
      })
  );
  if (res.ok) {
    const counts = await res.json();
    return formatCounts(counts);
  } else {
    console.error('[getCounts] An error happened while fetching counts', res);
    process.exit(1);
  }
}

function mergeCounts({ currentCounts, newCounts }) {
  const updatedCounts = [...currentCounts];
  for (const { month, count } of newCounts) {
    const isAlreadyTracked = updatedCounts.some(({ month: trackedMonth }) => trackedMonth === month);
    if (isAlreadyTracked) {
      // TODO check if count value is different
      continue;
    }

    // month is not yet tracked
    const { month: lastTrackedMonth } = updatedCounts[updatedCounts.length - 1];
    const isNextMonth = isNextMonthFn({ input: month, base: lastTrackedMonth });
    if (isNextMonth) {
      updatedCounts.push({ month, count });
      continue;
    }
    console.error('Missing month', month);
  }

  return updatedCounts;
}

function updateCounter({ file, counter }) {
  const filePath = path.join(directoryPath, file);
  fs.writeFileSync(filePath, JSON.stringify(counter, null, 2));
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

function getFirstDayOfYear() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  // Format the date as "dd/mm/yyyy"
  return `01/01/${year}`;
}

function isNextMonthFn({ input, base }) {
  const inputDate = new Date(input);
  const baseDate = new Date(base);

  // Check if date1 is exactly one month ahead of date2
  return (
    (inputDate.getFullYear() === baseDate.getFullYear() && inputDate.getMonth() === baseDate.getMonth() + 1) ||
    (inputDate.getFullYear() === baseDate.getFullYear() + 1 && inputDate.getMonth() === 0 && baseDate.getMonth() === 11)
  );
}
