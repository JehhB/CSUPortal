import { useQuery } from "@tanstack/react-query";
import profileService, {
  ProfilePictureResponse,
  StudentProfileError,
} from "./profileService";

const PICTURES_QUERY_KEY = "studentPictures";

export default function useStudentPictures(accessToken: string | null) {
  const picturesQuery = useQuery<ProfilePictureResponse, StudentProfileError>({
    queryKey: [PICTURES_QUERY_KEY, accessToken],
    queryFn: () => profileService.getPictures(accessToken),
    enabled: accessToken !== null,
  });

  return { picturesQuery };
}
