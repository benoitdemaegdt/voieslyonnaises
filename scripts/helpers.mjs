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
