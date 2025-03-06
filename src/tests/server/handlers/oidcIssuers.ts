import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import type { OidcIssuer } from "@/features/oidc";
import { oidcIssuers } from "@/tests/mocks/oidcIssuers";
import type { ApiListResponse } from "@/types/ApiListResponse";

export default [
  http.get<never, never, ApiListResponse<OidcIssuer>>(
    `${API_URL}auth/oidc-issuers`,
    () => {
      return HttpResponse.json({ results: oidcIssuers });
    },
  ),
];
