import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import {
  identityProviders,
  supportedProviders,
} from "@/tests/mocks/identityProviders";

export default [
  http.get(`${API_URL}identity-providers`, () => {
    return HttpResponse.json(identityProviders);
  }),
  http.get(`${API_URL}integrated-identity-providers`, () => {
    return HttpResponse.json(supportedProviders);
  }),
];
