import toOrdinal from "@/util/toOrdinal";
import { AdvisedSubject } from "./checklistService";

export default function semLabel(
  sem?: Pick<AdvisedSubject, "SubjectYearDescription" | "TermDescription">,
) {
  if (sem === undefined) return null;

  try {
    const year = toOrdinal(Number.parseInt(sem.SubjectYearDescription));
    const semester =
      sem.TermDescription === "S"
        ? "Summer"
        : toOrdinal(Number.parseInt(sem.TermDescription)) + " Semester";

    return `${year} Year (${semester})`;
  } catch (error) {
    console.warn(error);
    return null;
  }
}
