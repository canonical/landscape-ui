export interface UserCredentials {
  credentials: Credential[];
}

export interface Credential extends ApiKeyCredentials, Record<string, unknown> {
  account_title: string;
  endpoint: string;
  exports: string;
}

export interface ApiKeyCredentials {
  access_key: string;
  account_name: string;
  secret_key: string;
}
