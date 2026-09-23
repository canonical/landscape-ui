import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { StaffAccount } from "../types";

/**
 * A JSON merge patch of the account named `name`: omitted fields are left
 * alone, and `null` clears the subdomain or the Salesforce key.
 */
export interface EditStaffAccountParams {
  name: string;
  enabled_features?: number[];
  subdomain?: string | null;
  max_people_count?: number;
  max_attachment_size?: number;
  salesforce_account_key?: string | null;
}

export const useEditStaffAccount = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse<StaffAccount>,
    AxiosError<ApiError>,
    EditStaffAccountParams
  >({
    mutationFn: async ({ name, ...changes }) =>
      authFetch.patch(`accounts/${encodeURIComponent(name)}`, changes),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["staffAccounts"] }),
        // People results show each account's Salesforce key.
        queryClient.invalidateQueries({ queryKey: ["staffPeople"] }),
      ]),
  });

  return {
    editStaffAccount: mutateAsync,
    isEditingStaffAccount: isPending,
  };
};
