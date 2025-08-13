import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { authResponse } from "@/tests/mocks/auth";
import type {
  AuthStateResponse,
  LoginRequestParams,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "@/features/auth";
import {
  identityProviders,
  locationToRedirectTo,
  singleIdentityProviders,
  supportedProviders,
} from "@/tests/mocks/identityProviders";
import {
  allLoginMethods,
  employeeLoginMethods,
} from "@/tests/mocks/loginMethods";
import { getEndpointStatus } from "@/tests/controllers/controller";

interface SwitchAccountParams {
  account_name: string;
}

interface SwitchAccountResponse {
  token: string;
}

export default [
  http.post<never, LoginRequestParams, AuthStateResponse>(
    `${API_URL}login`,
    () => {
      return HttpResponse.json(authResponse);
    },
  ),

  http.get(`${API_URL}login/methods`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        {
          status: 500,
        },
      );
    }

    return HttpResponse.json(allLoginMethods);
  }),

  http.post<never, SwitchAccountParams, SwitchAccountResponse>(
    `${API_URL}switch-account`,
    async ({ request }) => {
      const { account_name } = await request.json();

      return HttpResponse.json({
        token: `${account_name}-token`,
      });
    },
  ),

  http.get(`${API_URL}identity-providers`, () => {
    return HttpResponse.json(identityProviders);
  }),

  http.get<{ id: string }, never, SingleIdentityProvider>(
    `${API_URL}auth/oidc-providers/:id`,
    ({ params }) => {
      return HttpResponse.json(
        singleIdentityProviders.find(({ id }) => `${id}` === params.id),
      );
    },
  ),

  http.get<never, never, { results: SupportedIdentityProvider[] }>(
    `${API_URL}auth/supported-providers`,
    () => {
      return HttpResponse.json({ results: supportedProviders });
    },
  ),

  http.get(`${API_URL}auth/start`, () => {
    return HttpResponse.json({ location: locationToRedirectTo });
  }),

  http.get(
    `${API_URL}ubuntu-installer-attach-sessions/code/:attach_code`,
    () => {
      return HttpResponse.json({
        valid: true,
        valid_until: new Date(Date.now() + 3600 * 1000).toISOString(),
      });
    },
  ),

  http.get(`${API_URL}employee-access/login/methods`, () => {
    return HttpResponse.json(employeeLoginMethods);
  }),

  http.get(`${API_URL}auth/handle-code`, () => {
    return HttpResponse.json({
      ...authResponse,
      attach_code: "QWER12",
    });
  }),

  http.get(`${API_URL}me`, () => {
    return HttpResponse.json(authResponse);
  }),

  http.get(`${API_URL}classic_dashboard_url`, () => {
    return HttpResponse.json({ url: "https://old-dashboard-url" });
  }),
];
