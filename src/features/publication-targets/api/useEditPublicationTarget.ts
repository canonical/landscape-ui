import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublicationTarget, S3Target, SwiftTarget } from "../types";

interface EditPublicationTargetParams {
  name: string;
  display_name?: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}

export default function useEditPublicationTarget() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const editPublicationTargetQuery = useMutation<
    AxiosResponse<PublicationTarget>,
    AxiosError<ApiError>,
    EditPublicationTargetParams
  >({
    mutationKey: ["publication-targets", "edit"],
    mutationFn: async ({ name, ...params }) => authFetch.patch(name, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
  });

  return {
    editPublicationTargetQuery,
  };
}
