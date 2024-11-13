import { useQuery } from "@tanstack/react-query";
import checklistService, {
  AdvisedSubject,
  StudentChecklistError,
} from "./checklistService";

const CHECKLIST_QUERY_KEY = "studentChecklist";

export default function useStudentChecklist(accessToken: string | null) {
  const checklistQuery = useQuery<
    AdvisedSubject[] | null,
    StudentChecklistError
  >({
    queryKey: [CHECKLIST_QUERY_KEY, accessToken],
    queryFn: () => checklistService.get(accessToken),
    enabled: accessToken !== null,
  });

  return { checklistQuery };
}
