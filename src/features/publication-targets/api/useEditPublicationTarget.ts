import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  PublicationTarget,
  S3Target,
  SwiftTarget,
} from "@/api/generated/debArchive.schemas";

interface EditPublicationTargetParams {
  name?: string;
  displayName: string;
  s3?: Partial<S3Target>;
  swift?: Partial<SwiftTarget>;
}

export default function useEditPublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const editPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    EditPublicationTargetParams
  >({
    mutationKey: ["publication-targets", "edit"],
    mutationFn: async ({ name, ...params }) =>
      authFetchDebArchive.patch(name ?? "", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    editPublicationTargetQuery,
  };
}
