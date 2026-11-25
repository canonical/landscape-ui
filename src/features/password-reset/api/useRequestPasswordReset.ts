import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/constants";

const publicFetch = axios.create({ baseURL: API_URL });

export default function useRequestPasswordReset() {
  const { mutateAsync, isPending, error } = useMutation({
    gcTime: 0,
    mutationFn: async (params: { email: string }) => {
      await publicFetch.post("password-reset/request", params);
    },
  });

  return {
    requestPasswordReset: mutateAsync,
    isRequestingPasswordReset: isPending,
    error,
  };
}
