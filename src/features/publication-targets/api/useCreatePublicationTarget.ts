import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  FilesystemTarget,
  PublicationTarget,
  S3Target,
  SwiftTarget,
} from "@canonical/landscape-openapi";

interface CreatePublicationTargetParams {
  displayName: string;
  s3?: Partial<S3Target>;
  swift?: Partial<SwiftTarget>;
  filesystem?: Partial<FilesystemTarget>;
}

export default function useCreatePublicationTarget() {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const createPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    CreatePublicationTargetParams
  >({
    mutationKey: ["publication-targets", "create"],
    mutationFn: async (params) =>
      authFetchDebArchive.post("publicationTargets", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    createPublicationTargetQuery,
  };
}
