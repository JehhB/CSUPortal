export function t12h(minutesSince7AM: number): string {
  const totalMinutes = 7 * 60 + minutesSince7AM;
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? "pm" : "am";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return minutes === 0
    ? `${hours12}${period}`
    : `${hours12}:${minutes.toString().padStart(2, "0")}${period}`;
}
