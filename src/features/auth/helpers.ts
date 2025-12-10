import { hasProperty } from "@/utils/_helpers";
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
  return hasProperty(SUPPORTED_PROVIDERS, slug)
    ? SUPPORTED_PROVIDERS[slug].icon
    : SUPPORTED_PROVIDERS.default.icon;
};
