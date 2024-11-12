import { StudentGwa } from "./gwaService";

export type StudentGwaPerSem = {
  year: number;
  sems: {
    sem: number | "summer";
    gwa: number | null;
    units: number;
  }[];
};

function getSem(periodCode: string): number | "summer" {
  if (periodCode.startsWith("S")) return "summer";

  try {
    const s = periodCode.split("-", 1).at(0);
    if (s === undefined) return 0;

    return Number.parseInt(s);
  } catch (e) {
    console.warn(e);
    return 0;
  }
}

export default function perSemGwa(record: StudentGwa): StudentGwaPerSem[] {
  const years = Object.keys(record).map((x) => Number.parseInt(x));
  years.sort((a, b) => a - b);

  const perSem: StudentGwaPerSem[] = [];

  for (const year of years) {
    const gwa: StudentGwaPerSem = {
      year,
      sems: record[year][0].map((val) => ({
        sem: getSem(val.PeriodCode),
        gwa:
          val.GradesEarned === null ? null : val.GradesEarned / val.UnitsEarned,
        units: val.UnitsEarned,
        gradeTotal: val.GradesEarned ?? 0,
      })),
    };
    perSem.push(gwa);
  }

  return perSem;
}
