import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import completionService from "./completionService";

export const STUDENT_COMPLETION_QUERY_KEY = "studentCompletion";

export type UseStudentCompletionOption = Partial<
  Omit<UndefinedInitialDataOptions, "queryFn">
>;

export default function useStudentCompletion(
  accessToken: string | null,
  options: UseStudentCompletionOption = {},
) {
  const completionQuery = useQuery({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: [
      STUDENT_COMPLETION_QUERY_KEY,
      accessToken,
      options.queryKey ?? [],
    ],
    queryFn: () => completionService.get(accessToken),
    enabled: (query) => {
      const option = options.enabled;
      const enabled =
        option === undefined
          ? true
          : typeof option == "function"
            ? option(query as any)
            : option;
      return accessToken !== null && enabled;
    },
  });

  return { completionQuery };
}
