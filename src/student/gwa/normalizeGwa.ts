import toOrdinal from "@/util/toOrdinal";
import { StudentGwaPerSem } from "./perSemGwa";

const NORMAL_SEMESTERS: [year: number, sem: number | "summer"][] = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 2],
  [3, 1],
  [3, 2],
  [4, 1],
  [4, 2],
];

export type StudentGwaNormalized = StudentGwaPerSem & {
  label: string;
  totalUnits: number;
  yearAverage: number | null;
};

function fillMissingSem(
  year: number,
  sems: StudentGwaPerSem["sems"],
): StudentGwaPerSem["sems"] {
  const result = [...sems];
  const expectedSems = NORMAL_SEMESTERS.filter((v) => v[0] === year).map(
    (v) => v[1],
  );
  const missingSems = expectedSems.filter(
    (v) => !result.some((sem) => sem.sem === v),
  );

  missingSems.forEach((v) => {
    result.push({
      sem: v,
      gwa: null,
      units: 0,
    });
  });

  result.sort((a, b) => {
    const aSem = a.sem === "summer" ? Number.MAX_SAFE_INTEGER : a.sem;
    const bSem = b.sem === "summer" ? Number.MAX_SAFE_INTEGER : b.sem;

    return aSem - bSem;
  });

  return result;
}

export default function normalizeGwa(
  gwaPerSem: StudentGwaPerSem[],
): StudentGwaNormalized[] {
  const result: StudentGwaNormalized[] = gwaPerSem
    .map((gwa) => ({
      year: gwa.year,
      label: toOrdinal(gwa.year) + " year",
      sems: fillMissingSem(gwa.year, gwa.sems),
    }))
    .map((gwa) => {
      const grade = gwa.sems.reduce(
        (a, b) => ({
          gwa: a.gwa + (b.gwa ?? 0) * b.units,
          units: b.gwa !== null && b.gwa > 0 ? a.units + b.units : 0,
        }),
        { gwa: 0, units: 0 },
      );

      return {
        ...gwa,
        yearAverage: grade.units > 0 ? grade.gwa / grade.units : null,
        totalUnits: grade.units,
      };
    });

  const expectedYears = NORMAL_SEMESTERS.map((v) => v[0]).filter(
    (x, i, a) => a.indexOf(x) === i,
  );
  const missingYears = expectedYears.filter(
    (v) => !result.some((x) => x.year === v),
  );

  missingYears.forEach((year) => {
    result.push({
      year,
      label: toOrdinal(year) + " year",
      sems: fillMissingSem(year, []),
      yearAverage: null,
      totalUnits: 0,
    });
  });

  result.sort((a, b) => a.year - b.year);

  return result;
}
