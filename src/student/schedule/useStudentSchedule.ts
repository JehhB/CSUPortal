import { useQuery } from "@tanstack/react-query";
import scheduleService, {
  StudentScheduleError,
  SubjectSchedule,
} from "./scheduleService";

export const STUDENT_SCHEDULE_QUERY_KEY = "studentSchedule";

export default function useStudentSchedule(accessToken: string | null) {
  const scheduleQuery = useQuery<
    SubjectSchedule[] | null,
    StudentScheduleError
  >({
    initialData: null,
    queryKey: [STUDENT_SCHEDULE_QUERY_KEY, accessToken],
    queryFn: () => scheduleService.get(accessToken),
    enabled: accessToken !== null,
  });

  return { scheduleQuery };
}
