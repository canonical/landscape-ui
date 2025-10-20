import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useFeatures from "@/hooks/useFeatures";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderHookWithProviders } from "@/tests/render";

describe("useFeatures", () => {
  beforeEach(() => {
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
});
