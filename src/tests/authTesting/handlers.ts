import { http, HttpResponse } from 'msw';
import { HttpStatusCode } from 'axios';
import { API_URL, ROOT_PATH, IS_SELF_HOSTED_ENV } from '@/constants';
import { authResponse, authUser } from '@/tests/mocks/auth';
import { identityProviders } from '@/tests/mocks/identityProviders';
import type { LoginMethods } from '@/features/auth';
import type { AuthTestingConfig } from './config';

export const MOCK_INVITATION_ID = 'mock-invite';
const accountTitle = 'Organization';
const selfHosted =
  IS_SELF_HOSTED_ENV === undefined ||
  ['true', '1'].includes(IS_SELF_HOSTED_ENV);
const pamFailure =
  'Unable to validate credentials against the configured PAM/LDAP service. Verify that the identity and password are valid and that the account is allowed to authenticate.';

const apiError = (
  message: string,
  status = HttpStatusCode.BadRequest,
  detail: unknown = null,
  error = 'ApiRequestError',
) => HttpResponse.json({ error, message, detail }, { status });

const validationError = (
  field: string | null,
  message: string,
  type = 'value_error',
) =>
  apiError(
    'invalid query/body arguments',
    HttpStatusCode.BadRequest,
    [
      {
        type,
        loc: field === null ? [] : [field],
        msg: type === 'value_error' ? `Value error, ${message}` : message,
      },
    ],
    'PydanticValidationError',
  );

export const createAuthTestingHandlers = (config: AuthTestingConfig) => {
  let { accountExists } = config;
  let invitationActive = true;
  let session: Record<string, unknown> | null = null;

  const signIn = () => {
    const response = { ...authResponse };
    session = response;
    return response;
  };

  const loginFailure = () => {
    switch (config.loginError) {
      case 'invalid_credentials':
        return apiError(
          'credentials are incorrect',
          HttpStatusCode.Unauthorized,
          null,
          'InvalidLoginError',
        );
      case 'pam_unavailable':
        return apiError(
          'PAM authentication is disabled.',
          HttpStatusCode.BadRequest,
          null,
          'AuthenticationFailure',
        );
      case 'password_disabled':
        return apiError(
          'Password authentication is disabled.',
          HttpStatusCode.BadRequest,
          null,
          'AuthenticationFailure',
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
      case 'pam_unavailable':
        return apiError(
          'PAM authentication is unavailable.',
          HttpStatusCode.BadRequest,
          {
            field: 'identity',
          },
        );
      case 'invalid_credentials':
        return apiError(pamFailure, HttpStatusCode.Unauthorized, {
          field: 'password',
        });
      case 'duplicate_email':
        return apiError(
          `A user with the email address ${email} already exists.`,
          HttpStatusCode.Conflict,
          { field: 'email' },
        );
      case 'duplicate_identity':
        return apiError(
          `A user with the PAM identity ${identity} already exists.`,
          HttpStatusCode.Conflict,
          { field: 'identity' },
        );
      case 'blank_password':
        return apiError(
          'Password must not be blank.',
          HttpStatusCode.BadRequest,
          {
            field: 'password',
          },
        );
      case 'weak_password':
        return apiError(
          'Password does not meet strength requirements.',
          HttpStatusCode.BadRequest,
          {
            field: 'password',
          },
        );
      case 'disabled_account':
        return apiError(
          'Account is disabled',
          HttpStatusCode.Forbidden,
          null,
          'UnauthorizedAccess',
        );
      case 'wrong_recipient':
        return HttpResponse.json(
          {
            error: 'InvalidInvitation',
            message: 'This invitation is intended for a different recipient.',
          },
          { status: HttpStatusCode.BadRequest },
        );
      case 'administrator_limit':
        return HttpResponse.json(
          {
            error: 'InvalidInvitation',
            message: `The '${accountTitle}' account has reached its administrator limit.`,
          },
          { status: HttpStatusCode.BadRequest },
        );
      default:
        return null;
    }
  };

  const providerStart = (request: Request, provider: 'oidc' | 'ubuntu-one') => {
    const params = new URL(request.url).searchParams;
    const callback = new URL(
      `${ROOT_PATH}handle-auth/${provider}`,
      window.location.origin,
    );
    callback.searchParams.set('code', 'mock-code');
    callback.searchParams.set('state', params.toString());
    if (!params.size) callback.searchParams.set('state', 'mock-state');
    for (const key of ['return_to', 'invitation_id', 'external']) {
      const value = params.get(key);
      if (value !== null) callback.searchParams.set(key, value);
    }
    return HttpResponse.json({ location: callback.href });
  };

  const providerCompletion = (params: URLSearchParams) => {
    const failure = loginFailure();
    if (failure) return failure;
    const invitationId = params.get('invitation_id');
    if (!accountExists && !invitationId) accountExists = true;
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
    const returnTo = params.get('return_to');
    return HttpResponse.json({
      ...response,
      has_password: false,
      invitation_id: null,
      return_to: returnTo
        ? { url: returnTo, external: params.get('external') === 'true' }
        : null,
    });
  };

  const invitationNotFound = (id: string) =>
    apiError(
      `No invitation with secure id '${id}'`,
      HttpStatusCode.NotFound,
      null,
      'InvitationNotFound',
    );

  return [
    http.get(`${API_URL}about`, () =>
      HttpResponse.json({
        self_hosted: selfHosted,
        package_version: '0.0.0-dev',
        revision: 'dev-rev',
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
          available: config.oidcEnabled && selfHosted,
          enabled: config.oidcEnabled && selfHosted,
        },
        oidc: {
          available: config.oidcEnabled && !selfHosted,
          configurations:
            config.oidcEnabled && !selfHosted ? [...identityProviders] : [],
        },
      };
      return HttpResponse.json(methods);
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
        case 'not_standalone':
          return apiError(
            'Not found.',
            HttpStatusCode.NotFound,
            null,
            'NotFound',
          );
        case 'blank_password':
          return validationError('password', 'Password must not be blank.');
        case 'weak_password':
          return validationError(
            null,
            'Password does not meet strength requirements. It must be at least 8 characters long and contain one uppercase letter, one lowercase letter, and one digit.',
          );
        case 'missing_password':
          return validationError(
            null,
            config.pamEnabled
              ? 'A password is required for PAM account creation.'
              : 'A password is required for account creation.',
          );
        case 'missing_identity':
          return validationError(
            null,
            'An Identity is required for PAM account creation.',
          );
        case 'invalid_identity':
          return validationError(
            'identity',
            'Identity contains invalid characters. Parentheses, asterisks, null bytes, and backslashes are not allowed.',
          );
        case 'blank_name':
          return validationError(
            'name',
            'String should have at least 1 character',
            'string_too_short',
          );
        case 'blank_identity':
          return validationError(
            'identity',
            'String should have at least 1 character',
            'string_too_short',
          );
      }
      if (config.creationError === 'account_exists' || accountExists) {
        return apiError(
          'A Landscape account already exists. Sign in with an existing user, or ask an administrator to invite you.',
          HttpStatusCode.Conflict,
        );
      }
      const failure = registrationFailure(
        config.creationError,
        values.email,
        values.identity ?? 'mock-identity',
      );
      if (failure) return failure;
      accountExists = true;
      return HttpResponse.json(
        {
          account: 'standalone',
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
        config.invitationError === 'not_found'
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
        config.invitationError === 'not_found'
      ) {
        return apiError(
          `No invitation with id ${values.invitation_id}`,
          HttpStatusCode.NotFound,
          null,
          'NotFound',
        );
      }
      const failure = registrationFailure(
        config.invitationError,
        values.email ?? authUser.email,
        values.identity ?? 'mock-identity',
      );
      if (failure) return failure;
      invitationActive = false;
      signIn();
      return HttpResponse.json({ account_id: 4, account_title: accountTitle });
    }),
    http.post(`${API_URL}reject-invitation`, async ({ request }) => {
      if (session === null)
        return apiError(
          'No JWT found in headers.',
          HttpStatusCode.Unauthorized,
          null,
          'JwtMissingException',
        );
      const values = (await request.json()) as { invitation_id: string };
      if (values.invitation_id !== MOCK_INVITATION_ID || !invitationActive) {
        return apiError(
          `No invitation with id ${values.invitation_id}`,
          HttpStatusCode.NotFound,
          null,
          'NotFound',
        );
      }
      invitationActive = false;
      return new HttpResponse(null, { status: HttpStatusCode.NoContent });
    }),
    http.get(`${API_URL}auth/start`, ({ request }) =>
      providerStart(request, 'oidc'),
    ),
    http.get(`${API_URL}auth/ubuntu-one/start`, ({ request }) =>
      providerStart(request, 'ubuntu-one'),
    ),
    http.get(`${API_URL}auth/handle-code`, ({ request }) =>
      providerCompletion(
        new URLSearchParams(
          new URL(request.url).searchParams.get('state') ?? '',
        ),
      ),
    ),
    http.get(`${API_URL}auth/ubuntu-one/complete`, ({ request }) => {
      const callbackUrl = new URL(request.url).searchParams.get('url');
      return providerCompletion(
        new URL(callbackUrl ?? window.location.href).searchParams,
      );
    }),
  ];
};
