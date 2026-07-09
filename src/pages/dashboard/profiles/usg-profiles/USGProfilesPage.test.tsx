import { usgProfiles } from "@/tests/mocks/usgProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import USGProfilesPage from "./USGProfilesPage";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { useGetUsgProfiles } from "@/features/usg-profiles";

describe("USGProfilesPage", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<USGProfilesPage />);
    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: "Add USG profileStep 1 of 5",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add USG profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to download", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=download&name=${usgProfiles[1].id}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Download audit for ${usgProfiles[1].title} USG profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to duplicate", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=duplicate&name=${usgProfiles[1].id}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Duplicate ${usgProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=edit&name=${usgProfiles[1].id}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${usgProfiles[1].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to run", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=run&name=${usgProfiles[1].id}`,
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Run "${usgProfiles[1].title}" profile`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <USGProfilesPage />,
      undefined,
      `/?sidePath=view&name=${usgProfiles[1].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: usgProfiles[1].title,
      }),
    ).toBeInTheDocument();
  });
});

// `useGetUsgProfiles` guards `search: params?.search || undefined`. A minimal
// consumer drives the hook directly with an empty search so the guard is
// deterministically exercised; if it were changed to `?? undefined` the empty
// string would leak into the request and this test would fail.
const EmptySearchConsumer: FC = () => {
  useGetUsgProfiles({ search: "" });
  return null;
};

describe("USG profiles request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}usg-profiles`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: usgProfiles,
          count: usgProfiles.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search when an empty search is provided", async () => {
    renderWithProviders(<EmptySearchConsumer />);

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
