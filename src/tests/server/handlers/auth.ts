import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { auth } from "@/tests/mocks/auth";
import {
  LoginRequestParams,
  LoginRequestResponse,
} from "@/pages/auth/login/LoginForm/LoginForm";

interface SwitchAccountParams {
  account_name: string;
}

interface SwitchAccountResponse {
  token: string;
}

export default [
  http.post<never, LoginRequestParams, LoginRequestResponse>(
    `${API_URL}login`,
    () => {
      return HttpResponse.json(auth);
    },
  ),

  http.post<never, SwitchAccountParams, SwitchAccountResponse>(
    `${API_URL}switch-account`,
    () => {
      return HttpResponse.json({
        token: auth.token,
      });
    },
  ),
];
