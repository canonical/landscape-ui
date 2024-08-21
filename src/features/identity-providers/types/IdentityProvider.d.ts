export interface IdentityProvider extends Record<string, unknown> {
  enabled: boolean;
  id: number;
  name: string;
  provider: string;
}

export interface SupportedIdentityProvider {
  provider_slug: string;
  provider_label: string;
  redirect_uri: string;
}

export interface UbuntuOneProviderConfiguration {
  _schema: string;
  client_id: string;
  client_secret: string;
  issuer: string;
  name: string;
  provider: "ubuntu-one";
}

export interface OktaProviderConfiguration {
  _schema: string;
  issuer: string;
  provider: "okta";
  name: string;
  client_id: string;
  client_secret: string;
  scopes: string[];
  discovery_enabled: boolean;
  discovery_uri: string;
}

type ProviderConfiguration =
  | UbuntuOneProviderConfiguration
  | OktaProviderConfiguration;

export interface SingleIdentityProvider {
  configuration: ProviderConfiguration;
  enabled: boolean;
}
