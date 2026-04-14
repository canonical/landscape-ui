import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublicationTarget, S3Target, SwiftTarget } from "../types";

interface CreatePublicationTargetParams {
  display_name: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}

export default function useCreatePublicationTarget() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const createPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    CreatePublicationTargetParams
  >({
    mutationKey: ["publication-targets", "create"],
    mutationFn: async (params) => authFetch.post("publicationTargets", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    createPublicationTargetQuery,
  };
}
