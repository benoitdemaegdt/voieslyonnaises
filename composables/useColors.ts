export const useColors = () => {
  function getLineColor(line: number): string {
    const colors = new Map();
    colors.set(1, '#60A75B');
    colors.set(2, '#AC4D35');
    colors.set(3, '#3B7B64');
    colors.set(4, '#DC8953');
    colors.set(5, '#AF7392');
    colors.set(6, '#396083');
    colors.set(7, '#75BCAE');
    colors.set(8, '#7E6D98');
    colors.set(9, '#EAAB50');
    colors.set(10, '#9A8A4B');
    colors.set(11, '#4DADC9');
    colors.set(12, '#DBABB7');
    return colors.get(line);
  }

  return { getLineColor };
};
