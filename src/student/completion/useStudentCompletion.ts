import { useQuery } from "@tanstack/react-query";
import completionService from "./completionService";

export const STUDENT_COMPLETION_QUERY_KEY = "studentCompletion";

export default function useStudentCompletion(accessToken: string | null) {
  const completionQuery = useQuery({
    staleTime: 1000 * 60 * 5,
    queryKey: [STUDENT_COMPLETION_QUERY_KEY, accessToken],
    queryFn: () => completionService.get(accessToken),
    enabled: accessToken !== null,
  });

  return { completionQuery };
}
