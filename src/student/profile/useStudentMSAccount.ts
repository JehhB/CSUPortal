import { useQuery } from "@tanstack/react-query";
import profileService, {
  MSAccountResponse,
  StudentProfileError,
} from "./profileService";

const MSACCOUNT_QUERY_KEY = "studentMsAccount";

export default function useStudentMsAccount(accessToken: string | null) {
  const msAccountQuery = useQuery<
    MSAccountResponse | null,
    StudentProfileError
  >({
    queryKey: [MSACCOUNT_QUERY_KEY, accessToken],
    queryFn: () => profileService.getMSAccount(accessToken),
    enabled: accessToken !== null,
  });

  return { msAccountQuery };
}
