import { useQuery } from "@tanstack/react-query";
import periodService, { PeriodError, PeriodResponse } from "./periodService";

export const STUDENT_PERIOD_QUERY_KEY = "studentPeriod";

export default function useStudentPeriod(accessToken: string | null) {
  const periodQuery = useQuery<PeriodResponse | null, PeriodError, string[]>({
    queryKey: [STUDENT_PERIOD_QUERY_KEY, accessToken],
    queryFn: () => periodService.get(accessToken),
    enabled: accessToken !== null,
    select: (data) => (data === null ? [] : data.map((v) => v.PeriodCode)),
  });

  return { periodQuery };
}
