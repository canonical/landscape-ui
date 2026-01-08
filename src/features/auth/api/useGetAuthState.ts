import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { API_URL } from "@/constants";
import type { AuthStateResponse, AuthUser } from "@/features/auth";

const publicFetch = axios.create({ baseURL: API_URL });

interface UseAuthStateOptions {
  enabled?: boolean;
}

export function useGetAuthState({ enabled = true }: UseAuthStateOptions = {}) {
  const {
    data: response,
    isLoading,
    isFetched,
  } = useQuery<AuthStateResponse>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await publicFetch.get<AuthStateResponse>("me");
      return res.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 0,
  });

  const user = useMemo<AuthUser | null>(() => {
    if (!response) {
      return null;
    }

    if ("current_account" in response && response.attach_code === null) {
      return response as AuthUser;
    }

    return null;
  }, [response]);

  return {
    user,
    isLoading: enabled ? isLoading : false,
    isFetched,
  };
}
