export function formatCounts(counts) {
  return counts.map(count => {
    const date = new Date(count[0]);
    const year = date.toLocaleDateString('fr-FR', { year: 'numeric' });
    const month = date.toLocaleDateString('fr-FR', { month: '2-digit' });
    return {
      month: `${year}/${month}/01`,
      count: Number(count[1])
    };
  });
}

export function getFirstDayOfYear() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  // Format the date as "dd/mm/yyyy"
  return `01/01/${year}`;
}

export function getFirstDayOfCurrentMonth() {
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
