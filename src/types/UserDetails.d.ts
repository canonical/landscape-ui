export interface UserDetails {
  allowable_emails: string[];
  name: string;
  email: string;
  identity: string;
  timezone: string;
  last_login_time: string;
  last_login_host: string;
  preferred_account: string;
  accounts: AccountKeyAndRoleInformation[];
}

interface AccountKeyAndRoleInformation {
  name: string;
  title: string;
  roles: string[];
}

export interface ApiKeyCredentials {
  account_name: string;
  access_key: string;
  secret_key: string;
}

export interface UserCredentials {
  credentials: Credential[];
}

export interface Credential extends ApiKeyCredentials {
  account_title: string;
  endpoint: string;
  exports: string;
}

export interface GeneralInfoInterface {
  email: string;
  timezone: string;
  identity: string;
}

export interface AccountDetail {
  name: string;
  title: string;
  roles: string[];
  credentials?: Credential;
}
