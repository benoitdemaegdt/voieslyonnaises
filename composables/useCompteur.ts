type Count = {
  month: string;
  count: number;
}

type Counter = {
  name: string;
  description: string;
  arrondissement: string;
  idPdc: string;
  coordinates: number[];
  lines: number[];
  counts: Count[];
}

export const useCompteur = () => {
  function getCounterLastRecord(counter: Counter) {
    const last = counter.counts.at(-1);
    return {
      month: new Date(last!.month).toLocaleString('fr-Fr', { month: 'short' }),
      year: new Date(last!.month).toLocaleString('fr-Fr', { year: 'numeric' }),
      value: last!.count.toLocaleString('fr-FR'),
      raw: last!.count
    };
  }

  // get record of same month of last record but previous year
  // ex : last record is November 2023. Should return record of November 2022
  function getCounterLastRecordPreviousYear(counter: Counter) {
    const last = counter.counts.at(-1);
    const lastRecordMonth = new Date(last!.month).getMonth();
    const lastRecordYear = new Date(last!.month).getFullYear();
    const lastRecordMonthPreviousYear = new Date(lastRecordYear - 1, lastRecordMonth, 1);
    const lastRecordMonthPreviousYearCount = counter.counts.find(count => new Date(count.month).getTime() === lastRecordMonthPreviousYear.getTime())?.count;
    return {
      month: new Date(lastRecordMonthPreviousYear).toLocaleString('fr-Fr', { month: 'short' }),
      year: new Date(lastRecordMonthPreviousYear).toLocaleString('fr-Fr', { year: 'numeric' }),
      value: lastRecordMonthPreviousYearCount?.toLocaleString('fr-FR') ?? 0,
      raw: lastRecordMonthPreviousYearCount ?? 0
    };
  }

  function getEvolution(counter: Counter) {
    if (getCounterLastRecord(counter).raw === 0) { return 0; }
    if (getCounterLastRecordPreviousYear(counter).raw === 0) { return 0; }
    return ((getCounterLastRecord(counter).raw - getCounterLastRecordPreviousYear(counter).raw) * 100 / getCounterLastRecordPreviousYear(counter).raw).toFixed(1); ;
  }

  return {
    getCounterLastRecord,
    getCounterLastRecordPreviousYear,
    getEvolution
  };
};
