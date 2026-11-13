import { renderHook, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  onTestFinished,
  vi,
} from "vitest";

import { API_URL_DEB_ARCHIVE } from "@/constants";
import useEnv from "@/hooks/useEnv";
import useFeatures from "@/hooks/useFeatures";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { saasEnv, selfHostedEnv } from "@/tests/mocks/env";
import { features } from "@/tests/mocks/features";
import { renderHookWithProviders } from "@/tests/render";
import server from "@/tests/server";

vi.mock("@/hooks/useEnv");

// API_URL_DEB_ARCHIVE is a path (e.g. "/v1/"), so match it as a substring of
// the request's absolute URL rather than parsing it against an origin.
const DEBARCHIVE_FEATURES_PATH = `${API_URL_DEB_ARCHIVE}features`;

// Records every GET to the DebArchive features endpoint for the current test,
// so a test can assert whether the gated request actually fired.
const trackDebarchiveFeatureRequests = (): string[] => {
  const requests: string[] = [];
  const onRequest = ({ request: { method, url } }: { request: Request }) => {
    if (method === "GET" && url.includes(DEBARCHIVE_FEATURES_PATH)) {
      requests.push(url);
    }
  };
  server.events.on("request:start", onRequest);
  onTestFinished(() => {
    server.events.removeListener("request:start", onRequest);
  });
  return requests;
};

describe("useFeatures", () => {
  beforeEach(() => {
    vi.mocked(useEnv).mockReturnValue(saasEnv);
    setEndpointStatus({
      status: "default",
      path: "/features",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports loading state while fetching features", async () => {
    const { result } = renderHook(() => useFeatures("test@example.com"), {
      wrapper: renderHookWithProviders(),
    });

    expect(result.current.isFeaturesLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isFeaturesLoading).toBe(false);
    });
  });

  it("returns correct enabled / disabled status for known features", async () => {
    const { result } = renderHook(() => useFeatures("test@example.com"), {
      wrapper: renderHookWithProviders(),
    });

    await waitFor(() => {
      expect(result.current.isFeaturesLoading).toBe(false);
    });

    expect(result.current.isFeatureEnabled("spa-dashboard")).toBe(true);
    expect(result.current.isFeatureEnabled("usg-profiles")).toBe(true);
  });

  it("warns and returns false when the endpoint is empty", async () => {
    // Simulate the server returning an empty list
    setEndpointStatus({
      status: "empty",
      path: "/features",
    });

    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    const { result } = renderHook(() => useFeatures("test@example.com"), {
      wrapper: renderHookWithProviders(),
    });

    await waitFor(() => {
      expect(result.current.isFeaturesLoading).toBe(false);
    });

    expect(result.current.isFeatureEnabled("spa-dashboard")).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      "Feature spa-dashboard not found in the features response.",
    );
  });

  it("returns false for every feature when the server errors", async () => {
    setEndpointStatus({
      status: "error",
      path: "/features",
    });

    const { result } = renderHook(() => useFeatures("test@example.com"), {
      wrapper: renderHookWithProviders(),
    });

    await waitFor(() => {
      expect(result.current.isFeaturesLoading).toBe(false);
    });

    expect(result.current.isFeatureEnabled("spa-dashboard")).toBe(false);
    expect(result.current.isFeatureEnabled("wsl-child-instance-profiles")).toBe(
      false,
    );
  });

  describe("DebArchive feature gating", () => {
    it("requests DebArchive features on a self-hosted deployment", async () => {
      vi.mocked(useEnv).mockReturnValue(selfHostedEnv);
      const debarchiveRequests = trackDebarchiveFeatureRequests();

      const { result } = renderHook(() => useFeatures("test@example.com"), {
        wrapper: renderHookWithProviders(),
      });

      await waitFor(() => {
        expect(result.current.isFeatureEnabled("temporal-lros")).toBe(true);
      });

      expect(debarchiveRequests).not.toHaveLength(0);
    });

    it("settles isFeaturesLoading without waiting for the debarchive query", async () => {
      vi.mocked(useEnv).mockReturnValue(selfHostedEnv);
      setEndpointStatus({ status: "loading", path: "debarchive/features" });

      const { result } = renderHook(() => useFeatures("test@example.com"), {
        wrapper: renderHookWithProviders(),
      });

      await waitFor(() => {
        expect(result.current.isFeaturesLoading).toBe(false);
      });

      expect(result.current.isFeatureEnabled("temporal-lros")).toBe(false);
    });

    it("requests DebArchive features in SaaS when repository-mirrors is enabled", async () => {
      vi.mocked(useEnv).mockReturnValue(saasEnv);
      setEndpointStatus({
        status: "variant",
        path: "features",
        response: {
          results: features.map((feature) =>
            feature.key === "repository-mirrors"
              ? { ...feature, enabled: true }
              : feature,
          ),
        },
      });
      const debarchiveRequests = trackDebarchiveFeatureRequests();

      const { result } = renderHook(() => useFeatures("test@example.com"), {
        wrapper: renderHookWithProviders(),
      });

      await waitFor(() => {
        expect(result.current.isFeatureEnabled("temporal-lros")).toBe(true);
      });

      expect(debarchiveRequests).not.toHaveLength(0);
    });

    it("does not request DebArchive features in SaaS when repository-mirrors is disabled", async () => {
      vi.mocked(useEnv).mockReturnValue(saasEnv);
      vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const debarchiveRequests = trackDebarchiveFeatureRequests();

      const { result } = renderHook(() => useFeatures("test@example.com"), {
        wrapper: renderHookWithProviders(),
      });

      await waitFor(() => {
        expect(result.current.isFeaturesLoading).toBe(false);
      });

      expect(debarchiveRequests).toHaveLength(0);
      expect(result.current.isFeatureEnabled("temporal-lros")).toBe(false);
    });
  });
});
