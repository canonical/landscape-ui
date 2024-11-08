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
