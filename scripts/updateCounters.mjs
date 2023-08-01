import fs from 'fs';
import path from 'path';
import { formatCounts, getFirstDayOfCurrentMonth, getFirstDayOfYear } from './helpers.mjs';

/**
 * Ce script permet de maj les données des compteurs vélo suivis
 * https://data.eco-counter.com/ParcPublic/?id=3902#
 *
 * required : NodeJS >= 18
 * run : node ./scripts/updateCounters.mjs
 */

const directoryPath = './content/compteurs';

(async () => {
  const counters = getCounters();
  for (const { file, counter } of counters) {
    console.log(' ');
    console.log(`<<<<<<< ${counter.name} >>>>>>>`);
    const newCounts = await getCounts(counter.idPdc, counter.flowIds);
    const counts = mergeCounts({ currentCounts: counter.counts, newCounts });
    updateCounter({ file, counter: { ...counter, counts } });
  }
})();

// Get all tracked counters.
function getCounters() {
  const files = fs.readdirSync(directoryPath);
  return files.map(file => {
    const filePath = path.join(directoryPath, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      file,
      counter: data
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

function isNextMonthFn({ input, base }) {
  const inputDate = new Date(input);
  const baseDate = new Date(base);

  // Check if date1 is exactly one month ahead of date2
  return (
    (inputDate.getFullYear() === baseDate.getFullYear() && inputDate.getMonth() === baseDate.getMonth() + 1) ||
    (inputDate.getFullYear() === baseDate.getFullYear() + 1 && inputDate.getMonth() === 0 && baseDate.getMonth() === 11)
  );
}
