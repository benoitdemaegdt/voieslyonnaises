import { getFirstDayOfCurrentMonth, getFirstDayOfYear } from './helpers.mjs';

(async () => {
  const idPdc = '100050687';
  const urlSearchParams = new URLSearchParams({
    idOrganisme: '3902',
    idPdc,
    flowIds: '101050687;102050687;103050687;104050687',
    debut: getFirstDayOfYear(),
    fin: getFirstDayOfCurrentMonth(),
    interval: '6' // month
  })
  const URL = `https://www.eco-visio.net/api/aladdin/1.0.0/pbl/publicwebpageplus/data/${idPdc}?${urlSearchParams}`;
  const res = await fetch(URL);
  if (res.ok) {
    const counts = await res.json();
    console.log('counts >>', counts)
  } else {
    console.error('[getCounts] An error happened while fetching counts', res);
    process.exit(1);
  }

})();