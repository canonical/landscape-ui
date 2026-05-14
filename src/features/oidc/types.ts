import type {
  IdentityProviderFeature,
  SupportedIdentityProviderBase,
} from "@/features/auth";

export interface OidcIssuer {
  id: number;
  url: string;
  provider: SupportedIdentityProviderBase;
  available_features: IdentityProviderFeature[];
}
