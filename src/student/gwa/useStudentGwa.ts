import { useQuery } from "@tanstack/react-query";
import gwaService, { StudentGwa, StudentGwaError } from "./gwaService";
import { useMemo } from "react";
import perSemGwa from "./perSemGwa";
import normalizeGwa from "./normalizeGwa";

const STUDENT_GWA_QUERY_KEY = "studentGwa";

export default function useStudentGwa(accessToken: string | null) {
  const gwaQuery = useQuery<StudentGwa, StudentGwaError>({
    queryKey: [STUDENT_GWA_QUERY_KEY, accessToken],
    queryFn: () => gwaService.get(accessToken),
    enabled: accessToken !== null,
  });

  const normalizedGwa = useMemo(() => {
    const gwa = perSemGwa(gwaQuery.data ?? {});
    return normalizeGwa(gwa);
  }, [gwaQuery.data]);

  return { gwaQuery, normalizedGwa };
}
