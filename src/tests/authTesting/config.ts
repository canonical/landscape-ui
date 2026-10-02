export const creationErrors = [
  'none',
  'account_exists',
  'pam_unavailable',
  'invalid_credentials',
  'not_standalone',
  'blank_password',
  'weak_password',
  'missing_password',
  'missing_identity',
  'invalid_identity',
  'blank_name',
  'blank_identity',
] as const;

export const loginErrors = [
  'none',
  'invalid_credentials',
  'pam_unavailable',
  'password_disabled',
] as const;

export const invitationErrors = [
  'none',
  'not_found',
  'duplicate_email',
  'duplicate_identity',
  'wrong_recipient',
  'administrator_limit',
  'pam_unavailable',
  'invalid_credentials',
  'blank_password',
  'weak_password',
  'disabled_account',
] as const;

type Environment = Record<string, string | boolean | undefined>;

const errorSelection = <Selection extends string>(
  environment: Environment,
  key: string,
  selections: readonly Selection[],
): Selection => {
  const value = environment[key] || 'none';
  const selection = selections.find((candidate) => candidate === value);
  if (selection === undefined) {
    throw new Error(`${key} must be one of: ${selections.join(', ')}`);
  }
  return selection;
};

export const getAuthTestingConfig = (environment: Environment) => {
  if (
    environment.VITE_MSW_ENABLED !== 'true' ||
    environment.VITE_MSW_AUTHENTICATION_TESTING !== 'true'
  ) {
    return null;
  }

  return {
    accountExists: environment.VITE_MSW_ACCOUNT_EXISTS !== 'false',
    pamEnabled: environment.VITE_MSW_PAM_ENABLED === 'true',
    passwordEnabled: environment.VITE_MSW_PASSWORD_ENABLED !== 'false',
    oidcEnabled: environment.VITE_MSW_OIDC_ENABLED === 'true',
    ubuntuOneEnabled: environment.VITE_MSW_UBUNTU_ONE_ENABLED !== 'false',
    creationError: errorSelection(
      environment,
      'VITE_MSW_AUTH_CREATION_ERROR',
      creationErrors,
    ),
    loginError: errorSelection(
      environment,
      'VITE_MSW_AUTH_LOGIN_ERROR',
      loginErrors,
    ),
    invitationError: errorSelection(
      environment,
      'VITE_MSW_AUTH_INVITATION_ERROR',
      invitationErrors,
    ),
  };
};

export type AuthTestingConfig = NonNullable<
  ReturnType<typeof getAuthTestingConfig>
>;
