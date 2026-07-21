import type { ProfileTypes } from "../../helpers";
import { EXTERNAL_PATHS } from "@/libs/routes/external";

/**
 * Documentation URLs for this component.
 * Build from EXTERNAL_PATHS.documentation to keep domain/base-path changes centralized.
 */
export const REPOSITORY_PROFILES_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/how-to-guides/repository-mirrors/manage-repositories-in-the-web-portal/#create-a-repository-profile-and-associate-client-machines-to-the-profile`;
export const USG_PROFILES_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/how-to-guides/security/use-usg-profiles/#how-to-web-portal-use-usg-profiles`;
export const WSL_PROFILES_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/how-to-guides/wsl-integration/use-wsl-profiles/#how-to-use-wsl-profiles`;
export const DEFAULT_PROFILES_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/how-to-guides/web-portal/web-portal-24-04-or-later/use-profiles/`;

export const getDefaultProfilesDocumentationUrl = (type: ProfileTypes) =>
  `${DEFAULT_PROFILES_DOCUMENTATION_URL}#${type}-profiles`;
