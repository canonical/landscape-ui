import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { auth } from "@/tests/mocks/auth";
import {
  LoginRequestParams,
  LoginRequestResponse,
} from "@/pages/auth/login/LoginForm/LoginForm";

export default [
  http.post<never, LoginRequestParams, LoginRequestResponse>(
    `${API_URL}login`,
    () => {
      return HttpResponse.json(auth);
    },
  ),
];
