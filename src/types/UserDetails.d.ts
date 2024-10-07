export interface UserDetails {
  accounts: AccountKeyAndRoleInformation[];
  allowable_emails: string[] | null;
  email: string;
  identity: string;
  last_login_host: string;
  last_login_time: string;
  name: string;
  oidc_identities: OidcIdentity[];
  preferred_account: string;
  timezone: string;
}

interface OidcIdentity {
  issuer: string;
  subject: string;
}

interface AccountKeyAndRoleInformation {
  name: string;
  roles: string[];
  title: string;
}

export interface ApiKeyCredentials {
  access_key: string;
  account_name: string;
  secret_key: string;
}

export interface UserCredentials {
  credentials: Credential[];
}

export interface Credential extends ApiKeyCredentials, Record<string, unknown> {
  account_title: string;
  endpoint: string;
  exports: string;
}

export interface GeneralInfoInterface {
  email: string;
  identity: string;
  timezone: string;
}

export interface AccountDetail {
  name: string;
  roles: string[];
  title: string;
  credentials?: Credential;
}
