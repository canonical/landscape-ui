import type { AuthUser, IdentityProvider } from "../types";

export interface LoginMethods {
  oidc: {
    available: boolean;
    configurations: IdentityProvider[];
  };
  pam: {
    available: boolean;
    enabled: boolean;
  };
  password: {
    available: boolean;
    enabled: boolean;
  };
  standalone_oidc: {
    available: boolean;
    enabled: boolean;
  };
  ubuntu_one: {
    available: boolean;
    enabled: boolean;
  };
}

export type AuthStateResponse =
  | Record<never, unknown>
  | (AuthUser & {
      return_to: {
        url: string | null;
        external: boolean;
      } | null;
      self_hosted: boolean;
      identity_source: string;
      attach_code: string | null;
      invitation_id: string | null;
    });

export interface LoginRequestParams {
  email: string;
  password: string;
}

export interface GetUbuntuOneUrlParams {
  external?: boolean;
  invitation_id?: string;
  return_to?: string;
}

export interface GetInvitationSummaryParams {
  invitationId: string;
}
