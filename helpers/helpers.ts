/**
 * Natif avec ES2023. En attendant ...
 */
export function groupBy<T, K extends string>(array: T[], predicate: (value: T, index: number, array: T[]) => K) {
  return array.reduce(
    (acc, value, index, array) => {
      (acc[predicate(value, index, array)] ||= []).push(value);
      return acc;
    },
    {} as Record<K, T[]>
  );
}
