import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { scripts } from "@/tests/mocks/script";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ProfilesProvider } from "@/context/profiles";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { FC, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScriptProfilesTab from "./ScriptProfilesTab";

const [scriptProfile] = scriptProfiles;

const withProfilesProvider: FC<{ readonly children: ReactNode }> = ({
  children,
}) => <ProfilesProvider path="/">{children}</ProfilesProvider>;

describe("ScriptProfilesTab", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("shows the no-scripts empty state when there are no scripts or profiles", async () => {
    setEndpointStatus([
      { status: "empty", path: "scripts" },
      { status: "empty", path: "script-profiles" },
    ]);

    renderWithProviders(<ScriptProfilesTab />);

    expect(
      await screen.findByText(
        "You need at least one active script to add a profile.",
      ),
    ).toBeInTheDocument();
  });

  it.each(["archived", "redacted"])(
    "requires an active script when only %s scripts and no profiles exist",
    async (status) => {
      setEndpointStatus({ status: "empty", path: "script-profiles" });
      server.use(
        http.get(`${API_URL}scripts`, ({ request }) => {
          const type = new URL(request.url).searchParams.get("script_type");
          const results =
            type === "v2"
              ? [{ ...scripts[0], status: status.toUpperCase() }]
              : [];
          return HttpResponse.json({ results, count: results.length });
        }),
      );

      renderWithProviders(<ScriptProfilesTab />);

      expect(
        await screen.findByText(
          "You need at least one active script to add a profile.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Add profile" }),
      ).not.toBeInTheDocument();
    },
  );

  it("keeps filters available when only archived profiles and scripts exist", async () => {
    const archivedProfile = { ...scriptProfile, archived: true };
    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        const type = new URL(request.url).searchParams.get("script_type");
        const results = type === "v2" ? [scripts[0]] : [];
        return HttpResponse.json({ results, count: results.length });
      }),
      http.get(`${API_URL}script-profiles`, ({ request }) => {
        const status = new URL(request.url).searchParams.get("archived");
        const results = status === "active" ? [] : [archivedProfile];
        return HttpResponse.json({ results, count: results.length });
      }),
    );

    renderWithProviders(<ScriptProfilesTab />);

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByText("No Active script profiles found."),
    ).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Archived" }));
    expect(await screen.findByText(archivedProfile.title)).toBeInTheDocument();
  });

  it("keeps profile filters available when no scripts remain but profiles exist", async () => {
    setEndpointStatus({ status: "empty", path: "scripts" });

    renderWithProviders(<ScriptProfilesTab />);

    expect(await screen.findByText(scriptProfile.title)).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Status" })).toBeInTheDocument();
  });

  it.each([
    ["archived", "Archived"],
    ["all", ""],
  ])(
    "shows an empty message for the %s status without a search",
    async (status, label) => {
      setEndpointStatus({ status: "empty", path: "script-profiles" });

      renderWithProviders(
        <ScriptProfilesTab />,
        undefined,
        `/?status=${status}`,
      );

      expect(await screen.findByRole("searchbox")).toBeInTheDocument();
      expect(
        screen.getByText(
          `No ${label ? `${label} ` : ""}script profiles found.`,
        ),
      ).toBeInTheDocument();
    },
  );

  it("shows a search message when searching with a status filter", async () => {
    setEndpointStatus({ status: "empty", path: "script-profiles" });
    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      "/?status=archived&search=missing",
    );

    expect(
      await screen.findByText(
        "No script profiles found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the profile empty state when scripts exist but no profiles do", async () => {
    setEndpointStatus({ status: "empty", path: "script-profiles" });

    renderWithProviders(<ScriptProfilesTab />);

    expect(
      await screen.findByText("You haven't added any script profiles yet."),
    ).toBeInTheDocument();
  });

  it("renders the profiles list when active scripts exist", async () => {
    renderWithProviders(<ScriptProfilesTab />);

    expect(await screen.findByText(scriptProfile.title)).toBeInTheDocument();
  });

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

  it("archives a profile through the row actions", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ScriptProfilesTab />,
      undefined,
      undefined,
      undefined,
      withProfilesProvider,
    );

    // Wait for the access-groups query to settle so the table columns stop
    // rebuilding (which would otherwise remount and close the actions menu).
    await screen.findAllByText("Global access");

    await user.click(
      await screen.findByRole("button", {
        name: `"${scriptProfile.title}" profile actions`,
      }),
    );

    await user.click(await screen.findByRole("menuitem", { name: /archive/i }));

    expect(
      await screen.findByText("Archive script profile"),
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox"),
      `archive ${scriptProfile.title}`,
    );

    await user.click(screen.getByRole("button", { name: "Archive" }));

    expect(
      await screen.findByText("Script profile archived"),
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
        if (
          url.searchParams.get("archived") === "active" &&
          url.searchParams.has("limit")
        ) {
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
