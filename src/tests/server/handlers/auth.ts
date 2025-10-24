import { http, HttpResponse } from "msw";
import { API_URL, ROOT_PATH } from "@/constants";
import { authResponse } from "@/tests/mocks/auth";
import type {
  AuthStateResponse,
  LoginRequestParams,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "@/features/auth";
import {
  identityProviders,
  oidcLocationToRedirectTo,
  singleIdentityProviders,
  supportedProviders,
} from "@/tests/mocks/identityProviders";
import { allLoginMethods } from "@/tests/mocks/loginMethods";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { invitationState } from "./invitations";

interface SwitchAccountParams {
  account_name: string;
}

interface SwitchAccountResponse {
  token: string;
}

interface CreatedAccount {
  account: string;
  creation_time: string;
  administrators: {
    name: string;
    email: string;
    openid: string;
  }[];
  disabled: boolean;
  disabled_reason: null;
  computers: number;
  company: string;
  last_login_time: string;
  licenses: unknown[];
  salesforce_account_key: null;
  enabled_features: unknown[];
  subdomain: null;
}

let createdAccount: CreatedAccount | null = null;

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

  http.post(`${API_URL}accounts`, async () => {
    createdAccount = {
      account: "8xag1afp",
      creation_time: "2025-09-15T22:52:11Z",
      administrators: [
        {
          name: "Your Name",
          email: "yourname@example.com",
          openid: "youropenid",
        },
      ],
      disabled: false,
      disabled_reason: null,
      computers: 0,
      company: "Onward, Inc.",
      last_login_time: "2025-09-15T22:52:11Z",
      licenses: [],
      salesforce_account_key: null,
      enabled_features: [],
      subdomain: null,
    };
    return HttpResponse.json(createdAccount);
  }),

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

  http.get(`${API_URL}auth/start`, ({ request }) => {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("return_to");

    let redirectUrl = `${location.origin}${oidcLocationToRedirectTo}`;

    if (returnTo) {
      redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
    }

    return HttpResponse.json({
      location: redirectUrl,
    });
  }),

  http.get(`${API_URL}auth/ubuntu-one/start`, ({ request }) => {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("return_to");

    let redirectUrl = `${location.origin}${ROOT_PATH}handle-auth/ubuntu-one?code=ubuntu-one-code&state=state123`;

    if (returnTo) {
      redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
    }

    return HttpResponse.json({
      location: redirectUrl,
    });
  }),

  http.get(
    `${API_URL}ubuntu-installer-attach-sessions/code/:attach_code`,
    () => {
      const HOUR_S = 3600;

      return HttpResponse.json({
        valid: true,
        valid_until: new Date(Date.now() + HOUR_S * 1000).toISOString(),
      });
    },
  ),

  http.get(`${API_URL}auth/handle-code`, ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (code === "attach-code") {
      return HttpResponse.json({
        ...authResponse,
        attach_code: "QWER12",
      });
    }

    /**
     * Simulate an invited user logging in via OIDC for the first time
     */
    // const baseResponse: AuthStateResponse = {
    //   accounts: [],
    //   current_account: "",
    //   email: "new-oidc-user@example.com",
    //   has_password: false,
    //   name: "New OIDC User",
    //   token: "new-oidc-token",
    //   return_to: {
    //     external: false,
    //     url: `${ROOT_PATH}accept-invitation/1`,
    //   },
    //   attach_code: null,
    //   invitation_id: 1,
    // };

    /**
     * Simulate OIDC create account
     */
    const baseResponse: AuthStateResponse = {
      accounts: [],
      current_account: "",
      email: "new-oidc-user@example.com",
      has_password: false,
      name: "New OIDC User",
      token: "new-oidc-token",
      return_to: null,
      attach_code: null,
    };

    /**
     * Simulate normal OIDC login
     */
    // const baseResponse: AuthStateResponse = {
    //   accounts: [
    //     {
    //       classic_dashboard_url: "",
    //       default: true,
    //       name: "existing-account",
    //       subdomain: null,
    //       title: "Existing Account Inc.",
    //     },
    //   ],
    //   current_account: "existing-account",
    //   email: "existing-account@example.com",
    //   has_password: true,
    //   name: "Existing Account",
    //   token: "existing-account-token",
    //   return_to: null,
    //   attach_code: null,
    // };

    return HttpResponse.json(baseResponse);
  }),

  http.get(`${API_URL}auth/ubuntu-one/complete`, ({ request }) => {
    const url = new URL(request.url);
    const callbackUrl = url.searchParams.get("url");

    let invitationIdFromUrl = null;

    if (callbackUrl) {
      const parsedCallback = new URL(callbackUrl);
      const returnToParam = parsedCallback.searchParams.get("return_to");

      if (returnToParam && returnToParam.includes("/accept-invitation/")) {
        const match = returnToParam.match(/\/accept-invitation\/([^/?]+)/);
        if (match) {
          [, invitationIdFromUrl] = match;
        }
      }
    }
    /**
     * Simulate a user logging in via Ubuntu One with no associated account
     */
    const baseResponse = {
      accounts: [],
      current_account: "",
      email: "new-user@example.com",
      has_password: false,
      name: "New Ubuntu One User",
      token: "new-user-token",
      return_to: null,
      attach_code: null,
    };

    /**
     * Simulate a user logging in via Ubuntu One with an associated account
     */
    // const baseResponse = {
    //   accounts: [
    //     {
    //       classic_dashboard_url: "",
    //       default: true,
    //       name: "standalone",
    //       subdomain: null,
    //       title: "Organization",
    //     },
    //   ],
    //   current_account: "",
    //   email: "new-user@example.com",
    //   has_password: false,
    //   name: "New Ubuntu One User",
    //   token: "new-user-token",
    //   return_to: null,
    //   attach_code: null,
    // };

    if (invitationIdFromUrl) {
      return HttpResponse.json({
        ...baseResponse,
        invitation_id: invitationIdFromUrl,
      });
    }

    return HttpResponse.json(baseResponse);
  }),
  http.get(`${API_URL}me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (invitationState.accepted) {
      const response = {
        ...authResponse,
        email: "new-user@example.com",
        name: "New Ubuntu One User",
        token: "new-user-token",
      };

      return HttpResponse.json(response);
    }

    if (token === "new-user-token") {
      return HttpResponse.json({
        accounts: [],
        current_account: "",
        email: "new-user@example.com",
        has_password: false,
        name: "New Ubuntu One User",
        token: "new-user-token",
        return_to: null,
        attach_code: null,
        invitation_id: null,
      });
    }

    if (token === "new-oidc-token") {
      const accounts = createdAccount
        ? [
            {
              classic_dashboard_url: "",
              default: true,
              name: createdAccount.account,
              subdomain: null,
              title: createdAccount.company,
            },
          ]
        : [
            {
              classic_dashboard_url: "",
              default: true,
              name: "8xag1afp",
              subdomain: null,
              title: "Onward, Inc.",
            },
          ];

      return HttpResponse.json({
        accounts,
        current_account: createdAccount ? createdAccount.account : "",
        email: "new-oidc-user@example.com",
        has_password: false,
        name: "New OIDC User",
        token: "new-oidc-token",
        return_to: null,
        attach_code: null,
        invitation_id: null,
      });
    }

    if (!token) {
      if (createdAccount === null) {
        return HttpResponse.json({});
      }

      return HttpResponse.json({
        accounts: [createdAccount],
        current_account: createdAccount ? createdAccount.account : "",
        email: "new-user@example.com",
        has_password: false,
        name: "New Ubuntu One User",
        token: "new-user-token",
        return_to: null,
        attach_code: null,
        invitation_id: null,
      });
    }
    return HttpResponse.json(authResponse);
  }),

  http.get(`${API_URL}classic_dashboard_url`, () => {
    return HttpResponse.json({ url: "https://old-dashboard-url" });
  }),
];
