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

export const getSameOriginUrl = (input?: string | null) => {
  if (!input) {
    return null;
  }

  try {
    const parsed = new URL(input, window.location.origin);

    if (parsed.origin !== window.location.origin) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const getSameOriginPath = (input?: string | null) => {
  const parsed = getSameOriginUrl(input);

  if (!parsed) {
    return null;
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
};

export const getProviderIcon = (slug: string) => {
  return hasProperty(SUPPORTED_PROVIDERS, slug)
    ? SUPPORTED_PROVIDERS[slug].icon
    : SUPPORTED_PROVIDERS.default.icon;
};
