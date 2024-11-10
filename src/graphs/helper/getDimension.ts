export type Dimension = number | `${number}%`;

export function getDimension(
  dimension: Dimension,
  relativeDimension: number,
): number {
  if (typeof dimension === "number") return dimension;
  return (Number.parseFloat(dimension) * relativeDimension) / 100;
}
