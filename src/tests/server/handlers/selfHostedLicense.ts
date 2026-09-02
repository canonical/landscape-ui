import { API_URL } from "@/constants";
import { selfHostedLicense } from "@/tests/mocks/selfHostedLicense";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}self-hosted/license`, () =>
    HttpResponse.json(selfHostedLicense),
  ),
];