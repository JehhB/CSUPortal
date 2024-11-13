import { AdvisedSubject } from "./checklistService";

export default function currentGrade(subjects: AdvisedSubject[]) {
  let units = 0;
  let gradeTotal = 0;

  for (const subject of subjects) {
    if (!subject.Grade) continue;
    try {
      const grade = Number.parseFloat(subject.Grade);
      if (grade <= 0) continue;

      units += subject.Units;
      gradeTotal += grade * subject.Units;
    } catch (error) {
      console.warn(error);
    }
  }

  if (units === 0) return [0, 0];

  return [gradeTotal / units, units];
}
