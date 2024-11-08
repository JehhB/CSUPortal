import { StudentGwaPerSem } from "./perSemGwa";

const NORMAL_SEMESTERS: [year: number, sem: number][] = [
  [1, 1],
  [1, 2],
  [2, 1],
  [2, 2],
  [3, 1],
  [3, 2],
  [4, 1],
  [4, 2],
];

const YEAR_LABELS = new Map<number, string>([
  [1, "1st year"],
  [2, "2nd year"],
  [3, "3rd year"],
  [4, "4th year"],
]);

const DEFAULT_YEAR_LABEL = "Extra";

export type StudentGwaNormalized = StudentGwaPerSem & {
  label: string;
};

function fillMissingSem(
  year: number,
  sems: StudentGwaPerSem["sems"],
): StudentGwaPerSem["sems"] {
  const result = [...sems];
  const expectedSems = NORMAL_SEMESTERS.filter((v) => v[0] == year).map(
    (v) => v[1],
  );
  const missingSems = expectedSems.filter(
    (v) => !result.some((sem) => sem.sem == v),
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
  const result: StudentGwaNormalized[] = gwaPerSem.map((gwa) => ({
    year: gwa.year,
    label: YEAR_LABELS.get(gwa.year) ?? DEFAULT_YEAR_LABEL,
    sems: fillMissingSem(gwa.year, gwa.sems),
  }));

  const expectedYears = NORMAL_SEMESTERS.map((v) => v[0]).filter(
    (x, i, a) => a.indexOf(x) === i,
  );
  const missingYears = expectedYears.filter(
    (v) => !result.some((x) => x.year === v),
  );

  missingYears.forEach((year) => {
    result.push({
      year,
      label: YEAR_LABELS.get(year) ?? DEFAULT_YEAR_LABEL,
      sems: fillMissingSem(year, []),
    });
  });

  result.sort((a, b) => a.year - b.year);

  return result;
}
