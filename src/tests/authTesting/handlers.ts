import { http, HttpResponse } from "msw";
import { HttpStatusCode } from "axios";
import { API_URL, ROOT_PATH, IS_SELF_HOSTED_ENV } from "@/constants";
import { authUser } from "@/tests/mocks/auth";
import { identityProviders } from "@/tests/mocks/identityProviders";
import type { AuthUser, LoginMethods } from "@/features/auth";
import type { AuthTestingConfig } from "./config";

export const MOCK_INVITATION_ID = "mock-invite";
export const MOCK_AUTH_HANDOFF_KEY = "landscape-msw-auth-handoff";

interface ProviderHandoff {
  storage: Storage;
  pathname: string;
}
const accountTitle = "Organization";
const selfHosted =
  IS_SELF_HOSTED_ENV === undefined ||
  ["true", "1"].includes(IS_SELF_HOSTED_ENV);
const pamFailure =
  "Unable to validate credentials against the configured PAM/LDAP service. Verify that the identity and password are valid and that the account is allowed to authenticate.";

const apiError = (
  message: string,
  status = HttpStatusCode.BadRequest,
  detail: unknown = null,
  error = "ApiRequestError",
) => HttpResponse.json({ error, message, detail }, { status });

const validationError = (
  field: string | null,
  message: string,
  type = "value_error",
) =>
  apiError(
    "invalid query/body arguments",
    HttpStatusCode.BadRequest,
    [
      {
        type,
        loc: field === null ? [] : [field],
        msg: type === "value_error" ? `Value error, ${message}` : message,
      },
    ],
    "PydanticValidationError",
  );

export const createAuthTestingHandlers = (
  config: AuthTestingConfig,
  isSelfHosted = selfHosted,
  handoff?: ProviderHandoff,
  initialSession: AuthUser | null = null,
) => {
  let { accountExists } = config;
  let invitationActive = config.invitationEnabled;
  let session: Record<string, unknown> | null = initialSession
    ? { ...initialSession }
    : null;
  let createdSaasAccount: (typeof authUser.accounts)[number] | null = null;

  const signIn = () => {
    let accounts = createdSaasAccount
      ? [createdSaasAccount]
      : authUser.accounts;
    if (!isSelfHosted && !accountExists) {
      accounts = [];
    }
    const response = {
      ...authUser,
      accounts,
      current_account:
        accounts.length === 0
          ? null
          : (createdSaasAccount?.name ?? authUser.current_account),
      return_to: null,
      attach_code: null,
    };
    session = response;
    return response;
  };

  if (config.invitationEnabled && config.invitationSignedIn) {
    session = {
      ...signIn(),
      accounts: [],
      current_account: null,
      invitation_id: MOCK_INVITATION_ID,
    };
  }

  if (handoff) {
    const serialized = handoff.storage.getItem(MOCK_AUTH_HANDOFF_KEY);
    handoff.storage.removeItem(MOCK_AUTH_HANDOFF_KEY);
    if (serialized) {
      try {
        const saved = JSON.parse(serialized) as {
          pathname: string;
          selfHosted: boolean;
          accountExists: boolean;
          invitationActive: boolean;
          session: Record<string, unknown>;
          createdSaasAccount: typeof createdSaasAccount;
        };
        if (
          saved.pathname === handoff.pathname &&
          saved.selfHosted === isSelfHosted &&
          typeof saved.accountExists === "boolean" &&
          typeof saved.invitationActive === "boolean" &&
          saved.session !== null &&
          typeof saved.session === "object" &&
          Array.isArray(saved.session.accounts)
        ) {
          ({ accountExists, invitationActive, session, createdSaasAccount } =
            saved);
        }
      } catch (error) {
        console.warn(
          "MSW auth testing: invalid provider session handoff",
          error,
        );
      }
    }
  }

  const loginFailure = () => {
    switch (config.loginError) {
      case "invalid_credentials":
        return apiError(
          "credentials are incorrect",
          HttpStatusCode.Unauthorized,
          null,
          "InvalidLoginError",
        );
      case "pam_unavailable":
        return apiError(
          "PAM authentication is disabled.",
          HttpStatusCode.BadRequest,
          null,
          "AuthenticationFailure",
        );
      case "password_disabled":
        return apiError(
          "Password authentication is disabled.",
          HttpStatusCode.BadRequest,
          null,
          "AuthenticationFailure",
        );
      default:
        return null;
    }
  };

  const registrationFailure = (
    scenario: string,
    email: string,
    identity: string,
  ) => {
    switch (scenario) {
      case "pam_unavailable":
        return apiError(
          "PAM authentication is unavailable.",
          HttpStatusCode.BadRequest,
          {
            field: "identity",
          },
        );
      case "invalid_credentials":
        return apiError(pamFailure, HttpStatusCode.Unauthorized, {
          field: "password",
        });
      case "duplicate_email":
        return apiError(
          `A user with the email address ${email} already exists.`,
          HttpStatusCode.Conflict,
          { field: "email" },
        );
      case "duplicate_identity":
        return apiError(
          `A user with the PAM identity ${identity} already exists.`,
          HttpStatusCode.Conflict,
          { field: "identity" },
        );
      case "blank_password":
        return apiError(
          "Password must not be blank.",
          HttpStatusCode.BadRequest,
          {
            field: "password",
          },
        );
      case "weak_password":
        return apiError(
          "Password does not meet strength requirements.",
          HttpStatusCode.BadRequest,
          {
            field: "password",
          },
        );
      case "disabled_account":
        return apiError(
          "Account is disabled",
          HttpStatusCode.Forbidden,
          null,
          "UnauthorizedAccess",
        );
      case "wrong_recipient":
        return HttpResponse.json(
          {
            error: "InvalidInvitation",
            message: "This invitation is intended for a different recipient.",
          },
          { status: HttpStatusCode.BadRequest },
        );
      case "administrator_limit":
        return HttpResponse.json(
          {
            error: "InvalidInvitation",
            message: `The '${accountTitle}' account has reached its administrator limit.`,
          },
          { status: HttpStatusCode.BadRequest },
        );
      default:
        return null;
    }
  };

  const providerCompletion = (params: URLSearchParams) => {
    const failure = loginFailure();
    if (failure) return failure;
    const invitationId = params.get("invitation_id");
    if (isSelfHosted && !accountExists && !invitationId) accountExists = true;
    const response = signIn();
    if (invitationId) {
      const invitedSession = {
        ...response,
        accounts: [],
        current_account: null,
        has_password: false,
        invitation_id: invitationId,
        return_to: null,
      };
      session = invitedSession;
      return HttpResponse.json(invitedSession);
    }
    const returnTo = params.get("return_to");
    const completedSession = {
      ...response,
      has_password: false,
      invitation_id: null,
      return_to: returnTo
        ? { url: returnTo, external: params.get("external") === "true" }
        : null,
    };
    session = completedSession;
    return HttpResponse.json(completedSession);
  };

  const providerStart = (request: Request) => {
    const params = new URL(request.url).searchParams;
    const completion = providerCompletion(params);
    if (!completion.ok) return completion;

    const destination = new URL(`${ROOT_PATH}overview`, window.location.origin);
    const invitationId = params.get("invitation_id");
    if (invitationId) {
      destination.pathname = `${ROOT_PATH}accept-invitation/${encodeURIComponent(invitationId)}`;
    } else if (!isSelfHosted && !accountExists) {
      destination.pathname = `${ROOT_PATH}create-account`;
    } else {
      const returnTo = params.get("return_to");
      if (returnTo) {
        const returnUrl = new URL(returnTo, window.location.origin);
        if (returnUrl.origin === window.location.origin) {
          destination.pathname = returnUrl.pathname;
          destination.search = returnUrl.search;
          destination.hash = returnUrl.hash;
        }
      }
    }

    if (handoff) {
      handoff.storage.setItem(
        MOCK_AUTH_HANDOFF_KEY,
        JSON.stringify({
          pathname: destination.pathname,
          selfHosted: isSelfHosted,
          accountExists,
          invitationActive,
          session,
          createdSaasAccount,
        }),
      );
    }
    return HttpResponse.json({ location: destination.href });
  };

  const invitationNotFound = (id: string) =>
    apiError(
      `No invitation with secure id '${id}'`,
      HttpStatusCode.NotFound,
      null,
      "InvitationNotFound",
    );

  return [
    http.get(`${API_URL}about`, () =>
      HttpResponse.json({
        self_hosted: isSelfHosted,
        package_version: "0.0.0-dev",
        revision: "dev-rev",
        display_disa_stig_banner: false,
      }),
    ),
    http.get(`${API_URL}me`, () => HttpResponse.json(session ?? {})),
    http.post(`${API_URL}login`, () => {
      const failure = loginFailure();
      return failure ?? HttpResponse.json(signIn());
    }),
    http.post(`${API_URL}logout`, () => {
      session = null;
      return new HttpResponse(null, { status: HttpStatusCode.NoContent });
    }),
    http.get(`${API_URL}login/methods`, () => {
      const methods: LoginMethods = {
        pam: { available: config.pamEnabled, enabled: config.pamEnabled },
        password: {
          available: config.passwordEnabled,
          enabled: config.passwordEnabled,
        },
        ubuntu_one: {
          available: config.ubuntuOneEnabled,
          enabled: config.ubuntuOneEnabled,
        },
        standalone_oidc: {
          available: config.oidcEnabled && isSelfHosted,
          enabled: config.oidcEnabled && isSelfHosted,
        },
        oidc: {
          available: config.oidcEnabled && !isSelfHosted,
          configurations:
            config.oidcEnabled && !isSelfHosted ? [...identityProviders] : [],
        },
      };
      return HttpResponse.json(methods);
    }),
    http.post(`${API_URL}accounts`, async ({ request }) => {
      if (session === null) {
        return apiError(
          "No JWT found in headers.",
          HttpStatusCode.Unauthorized,
          null,
          "JwtMissingException",
        );
      }
      if (accountExists || config.creationError === "account_exists") {
        return apiError("The current user already has an account.");
      }
      const { title } = (await request.json()) as { title: string };
      createdSaasAccount = {
        name: "mock-organization",
        title,
        default: true,
        subdomain: null,
        classic_dashboard_url: "",
      };
      accountExists = true;
      signIn();
      return HttpResponse.json(
        {
          account: createdSaasAccount.name,
          creation_time: new Date().toISOString(),
          administrators: [
            { name: authUser.name, email: authUser.email, openid: null },
          ],
          disabled: false,
          disabled_reason: null,
          computers: 0,
          company: title,
          last_login_time: null,
          licenses: [],
          salesforce_account_key: null,
          enabled_features: null,
          subdomain: null,
        },
        { status: HttpStatusCode.Created },
      );
    }),
    http.get(`${API_URL}standalone-account`, () =>
      HttpResponse.json({ exists: accountExists }),
    ),
    http.post(`${API_URL}standalone-account`, async ({ request }) => {
      const values = (await request.json()) as {
        name: string;
        email: string;
        identity?: string;
      };
      switch (config.creationError) {
        case "not_standalone":
          return apiError(
            "Not found.",
            HttpStatusCode.NotFound,
            null,
            "NotFound",
          );
        case "blank_password":
          return validationError("password", "Password must not be blank.");
        case "weak_password":
          return validationError(
            null,
            "Password does not meet strength requirements. It must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one digit.",
          );
        case "missing_password":
          return validationError(
            null,
            config.pamEnabled
              ? "A password is required for PAM account creation."
              : "A password is required for account creation.",
          );
        case "missing_identity":
          return validationError(
            null,
            "An Identity is required for PAM account creation.",
          );
        case "invalid_identity":
          return validationError(
            "identity",
            "Identity contains invalid characters. Parentheses, asterisks, null bytes, and backslashes are not allowed.",
          );
        case "blank_name":
          return validationError(
            "name",
            "String should have at least 1 character",
            "string_too_short",
          );
        case "blank_identity":
          return validationError(
            "identity",
            "String should have at least 1 character",
            "string_too_short",
          );
      }
      if (config.creationError === "account_exists" || accountExists) {
        return apiError(
          "A Landscape account already exists. Sign in with an existing user, or ask an administrator to invite you.",
          HttpStatusCode.Conflict,
        );
      }
      const failure = registrationFailure(
        config.creationError,
        values.email,
        values.identity ?? "mock-identity",
      );
      if (failure) return failure;
      accountExists = true;
      return HttpResponse.json(
        {
          account: "standalone",
          creation_time: new Date().toISOString(),
          administrators: [
            {
              name: values.name,
              email: values.email,
              openid: values.identity ?? null,
            },
          ],
          disabled: false,
          disabled_reason: null,
          computers: 0,
          company: accountTitle,
          last_login_time: null,
          licenses: [],
          salesforce_account_key: null,
          enabled_features: null,
          subdomain: null,
        },
        { status: HttpStatusCode.Created },
      );
    }),
    http.get(`${API_URL}invitations/:id/summary`, ({ params }) => {
      if (
        params.id !== MOCK_INVITATION_ID ||
        !invitationActive ||
        config.invitationError === "not_found"
      ) {
        return invitationNotFound(String(params.id));
      }
      return HttpResponse.json({
        secure_id: MOCK_INVITATION_ID,
        account_title: accountTitle,
      });
    }),
    http.post(`${API_URL}accept-invitation`, async ({ request }) => {
      const values = (await request.json()) as {
        invitation_id: string;
        email?: string;
        identity?: string;
      };
      if (
        values.invitation_id !== MOCK_INVITATION_ID ||
        !invitationActive ||
        config.invitationError === "not_found"
      ) {
        return apiError(
          `No invitation with id ${values.invitation_id}`,
          HttpStatusCode.NotFound,
          null,
          "NotFound",
        );
      }
      const failure = registrationFailure(
        config.invitationError,
        values.email ?? authUser.email,
        values.identity ?? "mock-identity",
      );
      if (failure) return failure;
      invitationActive = false;
      accountExists = true;
      signIn();
      return HttpResponse.json({ account_id: 4, account_title: accountTitle });
    }),
    http.post(`${API_URL}reject-invitation`, async ({ request }) => {
      if (session === null)
        return apiError(
          "No JWT found in headers.",
          HttpStatusCode.Unauthorized,
          null,
          "JwtMissingException",
        );
      const values = (await request.json()) as { invitation_id: string };
      if (values.invitation_id !== MOCK_INVITATION_ID || !invitationActive) {
        return apiError(
          `No invitation with id ${values.invitation_id}`,
          HttpStatusCode.NotFound,
          null,
          "NotFound",
        );
      }
      invitationActive = false;
      return new HttpResponse(null, { status: HttpStatusCode.NoContent });
    }),
    http.get(`${API_URL}auth/start`, ({ request }) => providerStart(request)),
    http.get(`${API_URL}auth/ubuntu-one/start`, ({ request }) =>
      providerStart(request),
    ),
    http.get(`${API_URL}auth/handle-code`, ({ request }) =>
      providerCompletion(
        new URLSearchParams(
          new URL(request.url).searchParams.get("state") ?? "",
        ),
      ),
    ),
    http.get(`${API_URL}auth/ubuntu-one/complete`, ({ request }) => {
      const callbackUrl = new URL(request.url).searchParams.get("url");
      return providerCompletion(
        new URL(callbackUrl ?? window.location.href).searchParams,
      );
    }),
  ];
};
