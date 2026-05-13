import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import { API_URL } from "@/constants";
import type { AuthUser } from "../types";
import {
  clearStoredAuthUser,
  getStoredAuthToken,
  setStoredAuthUser,
} from "../authStorage";
import type { AuthStateResponse } from "./types";

const HTTP_UNAUTHORIZED = 401;

const publicFetch = axios.create({ baseURL: API_URL });

interface UseAuthStateOptions {
  enabled?: boolean;
}

const isAuthUserResponse = (
  response: AuthStateResponse,
): response is AuthStateResponse & AuthUser =>
  "current_account" in response && response.attach_code === null;

export function useGetAuthState({ enabled = true }: UseAuthStateOptions = {}) {
  const {
    data: response,
    isLoading,
    isFetched,
  } = useQuery<AuthStateResponse>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = getStoredAuthToken();
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : undefined;

      try {
        const res = await publicFetch.get<AuthStateResponse>("me", { headers });

        if (isAuthUserResponse(res.data)) {
          setStoredAuthUser(res.data);
        } else {
          clearStoredAuthUser();
        }

        return res.data;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === HTTP_UNAUTHORIZED
        ) {
          clearStoredAuthUser();
        }
        throw error;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 0,
  });

  const user = useMemo<AuthUser | null>(() => {
    if (!response) {
      return null;
    }

    if (isAuthUserResponse(response)) {
      return response;
    }

    return null;
  }, [response]);

  return {
    user,
    isLoading: enabled ? isLoading : false,
    isFetched,
  };
}
