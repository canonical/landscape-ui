import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScriptProfilesTab from "./ScriptProfilesTab";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";

describe("ScriptProfilesTab", () => {
  it("has a button to add a profile", async () => {
    renderWithProviders(<ScriptProfilesTab />);

    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: "Add profile" }),
    );
    await expectLoadingState();

    expect(
      await screen.findByRole("heading", { name: "Add script profile" }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));

    expect(
      screen.queryByRole("heading", { name: "Add script profile" }),
    ).not.toBeInTheDocument();
  });

  it("renders a side panel to edit", async () => {
    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      `/?sidePath=edit&name=${scriptProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: `Edit ${scriptProfiles[0].title}`,
      }),
    ).toBeInTheDocument();
  });

  it("renders a side panel to view", async () => {
    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      `/?sidePath=view&name=${scriptProfiles[0].id}`,
    );

    await expectLoadingState();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("heading", {
        name: scriptProfiles[0].title,
      }),
    ).toBeInTheDocument();
  });
});

describe("Script profiles request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}script-profiles`, ({ request }) => {
        const url = new URL(request.url);

        // Only capture the URL-param-driven request (paginated), which is the
        // one that forwards the `search` page param via `useGetScriptProfiles`.
        if (url.searchParams.has("limit")) {
          capturedUrl = url;
        }

        return HttpResponse.json({
          results: scriptProfiles,
          count: scriptProfiles.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the page param is empty", async () => {
    renderWithProviders(<ScriptProfilesTab />, undefined, "/");

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
