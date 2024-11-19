import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import documentService, {
  DocumentServiceGetOptions,
  StudentDocumentsError,
} from "./documentsService";

export type UseStudentDocumentsOptions = Omit<
  UseMutationOptions<
    string | null,
    StudentDocumentsError,
    DocumentServiceGetOptions
  >,
  "mutationFn"
>;

export default function useStudentDocuments(
  options: UseStudentDocumentsOptions,
) {
  const documentMutation = useMutation<
    string | null,
    StudentDocumentsError,
    DocumentServiceGetOptions
  >({
    retry: 3,
    ...options,
    mutationFn: documentService.get,
  });

  return { documentMutation };
}
