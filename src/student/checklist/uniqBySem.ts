import { AdvisedSubject } from "./checklistService";
import uniqBy from "lodash/uniqBy";
import orderBy from "lodash/orderBy";

export default function uniqBySem(subjects: AdvisedSubject[]) {
  const sems = uniqBy(
    subjects,
    (subj) => `${subj.SubjectYearDescription}-${subj.TermDescription}`,
  );

  return orderBy(
    sems,
    ["SubjectYearDescription", "TermDescription"],
    ["asc", "asc"],
  );
}
