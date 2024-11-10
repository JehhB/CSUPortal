export function clamp(min: number, val: number, max: number) {
  return Math.min(max, Math.max(min, val));
}
