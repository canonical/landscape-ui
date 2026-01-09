export interface IdentityProvider extends Record<string, unknown> {
  enabled: boolean;
  id: number;
  name: string;
  provider: string;
}

export type IdentityProviderFeature = "directory-import";

export interface SupportedIdentityProviderBase {
  provider_slug: string;
  provider_label: string;
  supported_features: IdentityProviderFeature[];
}

export interface SupportedIdentityProvider extends SupportedIdentityProviderBase {
  redirect_uri: string;
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

type ProviderConfiguration = OktaProviderConfiguration;

export interface SingleIdentityProvider {
  configuration: ProviderConfiguration;
  enabled: boolean;
  id: number;
  redirect_uri: string;
}
