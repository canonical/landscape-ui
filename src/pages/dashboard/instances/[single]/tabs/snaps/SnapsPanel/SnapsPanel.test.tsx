import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SnapsPanel from "./SnapsPanel";
import { expectLoadingState } from "@/tests/helpers";
import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { installedSnaps } from "@/tests/mocks/snap";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";

describe("SnapsPanel", () => {
  it("shows loading state initially", async () => {
    renderWithProviders(
      <SnapsPanel />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await expectLoadingState();
  });

  it("shows snaps list after loading", async () => {
    renderWithProviders(
      <SnapsPanel />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("columnheader", { name: /name/i }),
    ).toBeInTheDocument();
  });
});

describe("Installed snaps request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(
        `${API_URL}computers/:instanceId/snaps/installed`,
        ({ request }) => {
          capturedUrl = new URL(request.url);
          return HttpResponse.json({
            results: installedSnaps,
            count: installedSnaps.length,
            next: null,
            previous: null,
          });
        },
      ),
    );
  });

  it("omits search entirely when the search param is empty", async () => {
    renderWithProviders(
      <SnapsPanel />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
