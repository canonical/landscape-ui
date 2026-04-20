import { afterEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";
import {
  getProviderIcon,
  getSameOriginPath,
  getSameOriginUrl,
  redirectToExternalUrl,
} from "./helpers";

describe("auth helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses location.assign by default for external redirects", () => {
    const assignSpy = vi.fn();
    const replaceSpy = vi.fn();

    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign: assignSpy,
      replace: replaceSpy,
    });

    const targetUrl = "https://example.com/login";
    redirectToExternalUrl(targetUrl);

    expect(assignSpy).toHaveBeenCalledWith(targetUrl);
  });

  it("uses location.replace when replace option is set", () => {
    const assignSpy = vi.fn();
    const replaceSpy = vi.fn();

    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      assign: assignSpy,
      replace: replaceSpy,
    });

    const targetUrl = "https://example.com/login";
    redirectToExternalUrl(targetUrl, { replace: true });

    expect(replaceSpy).toHaveBeenCalledWith(targetUrl);
  });

  it("returns null for missing and cross-origin inputs", () => {
    expect(getSameOriginUrl()).toBeNull();
    expect(getSameOriginUrl("https://google.com")).toBeNull();
    expect(getSameOriginUrl("http://%")).toBeNull();
  });

  it("resolves same-origin relative URLs", () => {
    const input = `${ROUTES.settings.root({ tab: "users" })}#top`;
    const parsed = getSameOriginUrl(input);

    expect(parsed).toBeInstanceOf(URL);
    expect(parsed?.pathname).toBe(ROUTES.settings.root());
    expect(parsed?.search).toBe("?tab=users");
    expect(parsed?.hash).toBe("#top");
  });

  it("returns same-origin path with query and hash", () => {
    const input = `${ROUTES.settings.root({ tab: "users" })}#top`;

    expect(getSameOriginPath(input)).toBe(
      `${ROUTES.settings.root({ tab: "users" })}#top`,
    );
    expect(getSameOriginPath("https://example.com/outside")).toBeNull();
  });

  it("falls back to the default provider icon for unknown providers", () => {
    expect(getProviderIcon("okta")).toBe("okta");
    expect(getProviderIcon("unknown-provider")).toBe("connected");
  });
});
