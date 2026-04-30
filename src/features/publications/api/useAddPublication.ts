import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Publication } from "../types";

interface CreatePublicationParams {
  publication_target: string;
  source: string;
  distribution?: string;
  label?: string;
  origin?: string;
  architectures?: string[];
  hash_indexing?: boolean;
  automatic_installation?: boolean;
  automatic_upgrades?: boolean;
  multi_dist?: boolean;
  skip_bz2?: boolean;
  skip_content_indexing?: boolean;
  gpg_key?: string;
}

export const useAddPublication = () => {
  const authFetchDebArchive = useFetchDebArchive();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<Publication>,
    AxiosError<ApiError>,
    CreatePublicationParams
  >({
    mutationKey: ["publication", "create"],
    mutationFn: async (params) =>
      authFetchDebArchive.post("publications", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["publications"] }),
  });

  return {
    addPublication: mutateAsync,
    isAddingPublication: isPending,
  };
};
