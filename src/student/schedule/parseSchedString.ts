import splitAt from "@/util/splitAt";
import clamp from "lodash/clamp";
import sortBy from "lodash/sortBy";

export type Schedule = {
  day: number;
  timeStart: number;
  timeEnd: number;
  room: string;
};

export default function parseSchedString(scheduleStr: string): Schedule[] {
  const schedules = scheduleStr.split("/").map((s) => s.trim());
  const result: Schedule[] = [];

  for (const schedule of schedules) {
    const [dayStr, timeAndRoom] = splitAt(schedule, /\s+/);
    if (timeAndRoom === "") continue;
    const days = expandDays(dayStr);

    const [time, room] = splitAt(timeAndRoom, /\s+/);
    if (room === "") continue;
    const timeRange = time.split(/\s*-\s*/);

    const timeStart = parseTime(timeRange[0]);
    const timeEnd = parseTime(timeRange[1], timeStart);

    // Create schedule object for each day
    for (const day of days) {
      result.push({
        day,
        timeStart,
        timeEnd,
        room,
      });
    }
  }

  return sortBy(result, [
    (s) => s.day,
    (s) => s.timeStart,
    (s) => s.timeEnd,
    (s) => s.room,
  ]);
}

function expandDays(dayStr: string): number[] {
  const dayMapping: { [key: string]: number } = {
    M: 0, // Monday
    T: 1, // Tuesday
    W: 2, // Wednesday
    Th: 3, // Thursday
    F: 4, // Friday
    S: 5, // Saturday
    Su: 6, // Sunday
  };

  const days: number[] = [];
  let i = 0;

  while (i < dayStr.length) {
    if (i + 1 < dayStr.length) {
      const twoChar = dayStr.substr(i, 2);
      if (twoChar === "Th" || twoChar === "Su") {
        days.push(dayMapping[twoChar]);
        i += 2;
        continue;
      }
    }

    const oneChar = dayStr[i];
    if (oneChar in dayMapping) {
      days.push(dayMapping[oneChar]);
    }
    i++;
  }

  return [...new Set(days)].sort();
}

function parseTime(timeStr: string, timeStart?: number): number {
  let hours = parseInt(timeStr);
  let minutes = 0;

  if (timeStr.length > 2) {
    minutes = parseInt(timeStr.slice(-2));
    hours = parseInt(timeStr.slice(0, -2));
  }

  if (hours < 7) hours += 12;

  let time = (hours - 7) * 60 + minutes;

  if (timeStart !== undefined && timeStart > time) time += 12 * 60;

  return clamp(time, 0, 12 * 60);
}
