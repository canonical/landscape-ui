import { API_URL } from "@/constants";
import {
  regeneratedSelfHostedLicense,
  selfHostedLicense,
} from "@/tests/mocks/selfHostedLicense";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}self-hosted/license-url`, () =>
    HttpResponse.json(selfHostedLicense),
  ),
  http.post(`${API_URL}self-hosted/license-url:regenerate`, () =>
    HttpResponse.json(regeneratedSelfHostedLicense),
  ),
];