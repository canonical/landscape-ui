import { SUPPORTED_PROVIDERS } from "./constants";

export const redirectToExternalUrl = (
  url: string,
  options?: { replace: boolean },
) => {
  if (options?.replace) {
    window.location.replace(url);
  } else {
    window.location.assign(url);
  }
};

export const getProviderIcon = (slug: string) => {
  return slug in SUPPORTED_PROVIDERS
    ? SUPPORTED_PROVIDERS[slug].icon
    : SUPPORTED_PROVIDERS.default.icon;
};
