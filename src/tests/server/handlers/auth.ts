import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { authResponse } from "@/tests/mocks/auth";
import {
  AuthStateResponse,
  LoginRequestParams,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "@/features/auth";
import {
  identityProviders,
  invitations,
  locationToRedirectTo,
  singleIdentityProviders,
  supportedProviders,
} from "@/tests/mocks/identityProviders";
import { InvitationSummary } from "@/types/Invitation";

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
    return HttpResponse.json({
      oidc: {
        available: false,
        configurations: [],
      },
      ubuntu_one: {
        available: true,
        enabled: true,
      },
      password: {
        available: true,
        enabled: true,
      },
    });
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

  http.get<{ id: string }, never, InvitationSummary>(
    `${API_URL}invitations/:id/summary`,
    ({ params }) => {
      return HttpResponse.json(
        invitations.find(({ secure_id }) => secure_id === params.id),
      );
    },
  ),

  http.get(`${API_URL}auth/start`, () => {
    return HttpResponse.json({ location: locationToRedirectTo });
  }),

  http.get(`${API_URL}me`, () => {
    return HttpResponse.json(authResponse);
  }),
];
