import { ROOT_PATH } from "@/constants";
import { ROUTES } from "@/libs/routes";
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

/** Returns where the login page sends the user once they are signed in. */
export const getLoginRedirect = (
  searchParams: URLSearchParams,
  rootPath: string = ROOT_PATH,
) => {
  const redirectTo = searchParams.get("redirect-to");

  // Served under a sub-path, the site root belongs to the server, which
  // knows the default location of the account.
  if (!redirectTo && rootPath !== "/") {
    return { redirectTo: "/", external: true };
  }

  return { redirectTo, external: searchParams.has("external") };
};

export const getInvitationPath = (
  secureId: string,
  searchParams: URLSearchParams,
) => {
  const forwarded = new URLSearchParams();
  const redirectTo = searchParams.get("redirect-to");

  if (redirectTo) {
    forwarded.set("redirect-to", redirectTo);
  }
  if (searchParams.has("external")) {
    forwarded.set("external", "true");
  }

  const path = ROUTES.auth.invitation({ secureId });
  const query = forwarded.toString();

  return query ? `${path}?${query}` : path;
};

export const getProviderIcon = (slug: string) => {
  return hasProperty(SUPPORTED_PROVIDERS, slug)
    ? SUPPORTED_PROVIDERS[slug].icon
    : SUPPORTED_PROVIDERS.default.icon;
};
