import { API_URL } from '@/constants';
import { HttpStatusCode } from 'axios';
import { authResponse } from '@/tests/mocks/auth';
import server from '@/tests/server';
import { describe, expect, it } from 'vitest';
import { createAuthTestingHandlers, MOCK_INVITATION_ID } from './handlers';
import { getAuthTestingConfig, type AuthTestingConfig } from './config';
import { createBrowserHandlers } from './browserHandlers';
import { allLoginMethods } from '@/tests/mocks/loginMethods';
import { renderWithProviders } from '@/tests/render';
import { AccountCreationSelfHostedForm } from '@/features/account-creation';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';

const enableScenario = (overrides: Partial<AuthTestingConfig> = {}) => {
  const config = getAuthTestingConfig({
    VITE_MSW_ENABLED: 'true',
    VITE_MSW_AUTHENTICATION_TESTING: 'true',
    VITE_MSW_ACCOUNT_EXISTS: 'false',
  });
  if (!config) throw new Error('Missing test scenario config');
  server.use(...createAuthTestingHandlers({ ...config, ...overrides }));
};

const post = (path: string, values: object) =>
  fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

describe('auth testing handlers', () => {
  it.each([false, true])(
    'supports the real creation form with PAM=%s',
    async (pamEnabled) => {
      enableScenario({ pamEnabled });
      renderWithProviders(
        createElement(AccountCreationSelfHostedForm),
        {},
        '/create-account',
      );
      const user = userEvent.setup();
      await user.type(await screen.findByLabelText('Full name'), 'Mock Tester');
      await user.type(
        screen.getByLabelText('Email address'),
        'mock@example.com',
      );
      if (pamEnabled)
        await user.type(
          screen.getByLabelText('PAM identity'),
          'arbitrary-identity',
        );
      await user.type(
        screen.getByLabelText(pamEnabled ? 'PAM password' : 'Password'),
        'Password1234',
      );
      await user.click(screen.getByRole('button', { name: 'Create account' }));
      await expect
        .poll(async () => await (await fetch(`${API_URL}me`)).json())
        .toEqual(authResponse);
    },
  );

  it('shows a forced creation error beneath the title and remains signed out', async () => {
    enableScenario({ creationError: 'account_exists' });
    renderWithProviders(
      createElement(AccountCreationSelfHostedForm),
      {},
      '/create-account',
    );
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText('Full name'), 'Mock Tester');
    await user.type(screen.getByLabelText('Email address'), 'mock@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password1234');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    const message = await screen.findByText(
      'A Landscape account already exists. Sign in with an existing user, or ask an administrator to invite you.',
    );
    const heading = screen.getByRole('heading', {
      name: 'Create a new Landscape account',
    });
    expect(heading.nextElementSibling).toContainElement(message);
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual({});
  });

  it.each([
    ['blank_password', ['password'], 'value_error'],
    ['weak_password', [], 'value_error'],
    ['missing_password', [], 'value_error'],
    ['missing_identity', [], 'value_error'],
    ['invalid_identity', ['identity'], 'value_error'],
    ['blank_name', ['name'], 'string_too_short'],
    ['blank_identity', ['identity'], 'string_too_short'],
  ] as const)(
    'returns the creation %s validation contract',
    async (scenario, loc, type) => {
      enableScenario({ creationError: scenario });
      const response = await post('standalone-account', {
        name: 'Tester',
        email: 'mock@example.com',
        password: 'anything',
      });
      expect(response.status).toBe(HttpStatusCode.BadRequest);
      expect(await response.json()).toMatchObject({
        error: 'PydanticValidationError',
        message: 'invalid query/body arguments',
        detail: [{ loc, type }],
      });
      expect(
        await (await fetch(`${API_URL}standalone-account`)).json(),
      ).toEqual({ exists: false });
    },
  );
  it('preserves existing login-method defaults without the opt-in gate', async () => {
    server.use(...createBrowserHandlers(null));
    expect(await (await fetch(`${API_URL}login/methods`)).json()).toEqual(
      allLoginMethods,
    );
  });

  it('does not pass unmatched APIs through in auth testing mode', async () => {
    const config = getAuthTestingConfig({
      VITE_MSW_ENABLED: 'true',
      VITE_MSW_AUTHENTICATION_TESTING: 'true',
    });
    server.use(...createBrowserHandlers(config));
    const response = await fetch(`${API_URL}missing-auth-testing-handler`);
    expect(response.status).toBe(HttpStatusCode.NotImplemented);
    expect(await response.json()).toMatchObject({
      error: 'MissingMockHandler',
    });
  });

  it('maps all configured login method flags into the real response shape', async () => {
    enableScenario({
      pamEnabled: true,
      passwordEnabled: false,
      oidcEnabled: false,
      ubuntuOneEnabled: false,
    });
    expect(await (await fetch(`${API_URL}login/methods`)).json()).toEqual({
      pam: { available: true, enabled: true },
      password: { available: false, enabled: false },
      oidc: { available: false, configurations: [] },
      standalone_oidc: { available: false, enabled: false },
      ubuntu_one: { available: false, enabled: false },
    });
  });

  it('starts signed out, creates an account, and signs in with the existing mock', async () => {
    enableScenario();
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual({});
    expect(await (await fetch(`${API_URL}standalone-account`)).json()).toEqual({
      exists: false,
    });

    const response = await post('standalone-account', {
      name: 'Tester',
      email: 'tester@example.com',
      password: 'anything',
    });
    expect(response.status).toBe(HttpStatusCode.Created);
    expect(await response.json()).toMatchObject({
      account: 'standalone',
      administrators: [
        { name: 'Tester', email: 'tester@example.com', openid: null },
      ],
      last_login_time: null,
    });
    expect(await (await fetch(`${API_URL}standalone-account`)).json()).toEqual({
      exists: true,
    });
    expect(
      await (
        await post('login', {
          email: 'tester@example.com',
          password: 'anything',
        })
      ).json(),
    ).toEqual(authResponse);
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual(authResponse);
    expect((await post('logout', {})).status).toBe(HttpStatusCode.NoContent);
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual({});
  });

  it('accepts arbitrary PAM identities and passwords', async () => {
    enableScenario({ pamEnabled: true });
    const response = await post('standalone-account', {
      name: 'PAM Tester',
      email: 'pam@example.com',
      identity: 'any-identity',
      password: 'x',
    });
    expect(response.status).toBe(HttpStatusCode.Created);
    expect(await response.json()).toMatchObject({
      administrators: [{ openid: 'any-identity' }],
    });
    expect(
      (await post('login', { identity: 'different-identity', password: 'y' }))
        .status,
    ).toBe(HttpStatusCode.Ok);
  });

  it('keeps creation reachable while repeatedly forcing the real account-exists error', async () => {
    enableScenario({ creationError: 'account_exists' });
    for (const attempt of [1, 2]) {
      const response = await post('standalone-account', {
        name: `Tester ${attempt}`,
        email: 'test@example.com',
        password: 'anything',
      });
      expect(response.status).toBe(HttpStatusCode.Conflict);
      expect(await response.json()).toEqual({
        error: 'ApiRequestError',
        message:
          'A Landscape account already exists. Sign in with an existing user, or ask an administrator to invite you.',
        detail: null,
      });
    }
    expect(await (await fetch(`${API_URL}standalone-account`)).json()).toEqual({
      exists: false,
    });
  });

  it('returns real login failure fields without establishing a session', async () => {
    enableScenario({ loginError: 'invalid_credentials' });
    const response = await post('login', {
      identity: 'anyone',
      password: 'anything',
    });
    expect(response.status).toBe(HttpStatusCode.Unauthorized);
    expect(await response.json()).toEqual({
      error: 'InvalidLoginError',
      message: 'credentials are incorrect',
      detail: null,
    });
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual({});
  });

  it('accepts the fixed invitation and establishes a session', async () => {
    enableScenario({ accountExists: true });
    expect(
      await (
        await fetch(`${API_URL}invitations/${MOCK_INVITATION_ID}/summary`)
      ).json(),
    ).toEqual({ secure_id: MOCK_INVITATION_ID, account_title: 'Organization' });
    const response = await post('accept-invitation', {
      invitation_id: MOCK_INVITATION_ID,
      name: 'Invitee',
      email: 'any@example.com',
      password: 'anything',
    });
    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(await response.json()).toEqual({
      account_id: 4,
      account_title: 'Organization',
    });
    expect(await (await fetch(`${API_URL}me`)).json()).toEqual(authResponse);
    expect(
      (await fetch(`${API_URL}invitations/${MOCK_INVITATION_ID}/summary`))
        .status,
    ).toBe(HttpStatusCode.NotFound);
  });

  it('forces duplicate email without consuming the invitation', async () => {
    enableScenario({ invitationError: 'duplicate_email' });
    const response = await post('accept-invitation', {
      invitation_id: MOCK_INVITATION_ID,
      email: 'invitee@example.com',
    });
    expect(response.status).toBe(HttpStatusCode.Conflict);
    expect(await response.json()).toEqual({
      error: 'ApiRequestError',
      message:
        'A user with the email address invitee@example.com already exists.',
      detail: { field: 'email' },
    });
    expect(
      (await fetch(`${API_URL}invitations/${MOCK_INVITATION_ID}/summary`))
        .status,
    ).toBe(HttpStatusCode.Ok);
  });

  it('does not match unknown invitation IDs', async () => {
    enableScenario();
    expect((await fetch(`${API_URL}invitations/unknown/summary`)).status).toBe(
      HttpStatusCode.NotFound,
    );
  });

  it.each([
    [
      'duplicate_identity',
      HttpStatusCode.Conflict,
      'ApiRequestError',
      'identity',
    ],
    [
      'pam_unavailable',
      HttpStatusCode.BadRequest,
      'ApiRequestError',
      'identity',
    ],
    [
      'invalid_credentials',
      HttpStatusCode.Unauthorized,
      'ApiRequestError',
      'password',
    ],
    [
      'blank_password',
      HttpStatusCode.BadRequest,
      'ApiRequestError',
      'password',
    ],
    ['weak_password', HttpStatusCode.BadRequest, 'ApiRequestError', 'password'],
    ['wrong_recipient', HttpStatusCode.BadRequest, 'InvalidInvitation', null],
    [
      'administrator_limit',
      HttpStatusCode.BadRequest,
      'InvalidInvitation',
      null,
    ],
    ['disabled_account', HttpStatusCode.Forbidden, 'UnauthorizedAccess', null],
  ] as const)(
    'repeats the invitation %s error contract',
    async (scenario, status, error, field) => {
      enableScenario({ invitationError: scenario });
      for (const attempt of [1, 2]) {
        const response = await post('accept-invitation', {
          invitation_id: MOCK_INVITATION_ID,
          email: 'test@example.com',
          identity: `tester-${attempt}`,
        });
        expect(response.status).toBe(status);
        const body = await response.json();
        expect(body.error).toBe(error);
        if (field) expect(body.detail).toEqual({ field });
      }
      expect(await (await fetch(`${API_URL}me`)).json()).toEqual({});
    },
  );

  it('forces invitation-not-found before displaying the form', async () => {
    enableScenario({ invitationError: 'not_found' });
    const response = await fetch(
      `${API_URL}invitations/${MOCK_INVITATION_ID}/summary`,
    );
    expect(response.status).toBe(HttpStatusCode.NotFound);
    expect(await response.json()).toEqual({
      error: 'InvitationNotFound',
      message: `No invitation with secure id '${MOCK_INVITATION_ID}'`,
      detail: null,
    });
  });

  it.each(['oidc', 'ubuntu-one'] as const)(
    'simulates %s redirects and callback session without a provider',
    async (provider) => {
      enableScenario({ oidcEnabled: true, accountExists: true });
      const startPath =
        provider === 'oidc' ? 'auth/start' : 'auth/ubuntu-one/start';
      const { location } = await (
        await fetch(
          `${API_URL}${startPath}?invitation_id=${MOCK_INVITATION_ID}&return_to=/accept-invitation/${MOCK_INVITATION_ID}`,
        )
      ).json();
      const callback = new URL(location);
      expect(callback.origin).toBe(window.location.origin);
      expect(callback.pathname).toBe(`/handle-auth/${provider}`);
      const completionPath =
        provider === 'oidc'
          ? `auth/handle-code?code=mock-code&state=${encodeURIComponent(callback.searchParams.get('state') ?? '')}`
          : `auth/ubuntu-one/complete?url=${encodeURIComponent(location)}`;
      const session = await (await fetch(`${API_URL}${completionPath}`)).json();
      expect(session).toMatchObject({
        accounts: [],
        current_account: null,
        invitation_id: MOCK_INVITATION_ID,
      });
      expect(await (await fetch(`${API_URL}me`)).json()).toEqual(session);
      expect(
        (await post('accept-invitation', { invitation_id: MOCK_INVITATION_ID }))
          .status,
      ).toBe(HttpStatusCode.Ok);
    },
  );

  it('bootstraps a first account during federated sign-in', async () => {
    enableScenario({ oidcEnabled: true });
    expect(
      (
        await fetch(
          `${API_URL}auth/handle-code?code=mock-code&state=mock-state`,
        )
      ).status,
    ).toBe(HttpStatusCode.Ok);
    expect(await (await fetch(`${API_URL}standalone-account`)).json()).toEqual({
      exists: true,
    });
  });

  it('requires sign-in to reject an invitation and removes it after rejection', async () => {
    enableScenario({ accountExists: true });
    expect(
      (await post('reject-invitation', { invitation_id: MOCK_INVITATION_ID }))
        .status,
    ).toBe(HttpStatusCode.Unauthorized);
    await post('login', { email: 'any@example.com', password: 'anything' });
    expect(
      (await post('reject-invitation', { invitation_id: MOCK_INVITATION_ID }))
        .status,
    ).toBe(HttpStatusCode.NoContent);
    expect(
      (await fetch(`${API_URL}invitations/${MOCK_INVITATION_ID}/summary`))
        .status,
    ).toBe(HttpStatusCode.NotFound);
  });
});
