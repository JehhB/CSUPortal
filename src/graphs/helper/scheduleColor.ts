import { hsv } from "color";

const COLOR_HUE_RANGE = 270;

export default function scheduleColor(i: number, n: number): string {
  const base = [204, 50, 93];
  if (n === 0) return hsv(base).hex();
  const steps = COLOR_HUE_RANGE / n;
  base[0] += steps * i;
  return hsv(base).hex();
}
