import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/constants";

const publicFetch = axios.create({ baseURL: API_URL });

interface ConfirmPasswordResetParams {
  token: string;
  email_address: string;
  new_password: string;
}

export default function useConfirmPasswordReset() {
  const { mutateAsync, isPending, error } = useMutation({
    gcTime: 0,
    mutationFn: async (params: ConfirmPasswordResetParams) => {
      await publicFetch.post("password-reset/confirm", params);
    },
  });

  return {
    confirmPasswordReset: mutateAsync,
    isConfirmingPasswordReset: isPending,
    error,
  };
}
