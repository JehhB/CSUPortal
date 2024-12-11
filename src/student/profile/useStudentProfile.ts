import { useQuery } from "@tanstack/react-query";
import profileService, {
  StudentProfile,
  StudentProfileError,
} from "./profileService";

const PROFILE_QUERY_KEY = "studentProfile";

export default function useStudentProfile(accessToken: string | null) {
  const profileQuery = useQuery<StudentProfile | null, StudentProfileError>({
    queryKey: [PROFILE_QUERY_KEY, accessToken],
    queryFn: () => profileService.get(accessToken),
    enabled: accessToken !== null,
  });

  return { profileQuery };
}
