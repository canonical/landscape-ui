import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import SupportSessionPage from "@/pages/super-admin/accounts/SupportSessionPage";
import { authResponse } from "@/tests/mocks/auth";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import SupportProfilesPage from "./SupportProfilesPage";

const ACME = "acme";

const [packageProfile] = packageProfiles;
const [upgradeProfile] = upgradeProfiles;
const [rebootProfile] = rebootProfiles;
const [removalProfile] = removalProfiles;
const [repositoryProfile] = repositoryProfiles;

/** Signs in as staff whose session is already in the account. */
const signIn = () => {
  setStaffGlobalRoles(["SupportProvider"]);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({
        ...authResponse,
        current_account: ACME,
        global_roles: ["SupportProvider"],
      }),
    ),
  );
};

const renderProfiles = (profileType: string, search = "") =>
  renderWithProviders(
    <Routes>
      <Route
        path={`/${PATHS.superAdmin.root}/${PATHS.superAdmin.session}`}
        element={<SupportSessionPage />}
      >
        <Route
          path={PATHS.superAdmin.sessionProfiles}
          element={<SupportProfilesPage />}
        />
        <Route
          path={PATHS.superAdmin.sessionProfile}
          element={<SupportProfilesPage />}
        />
      </Route>
    </Routes>,
    undefined,
    `${ROUTES.superAdmin.sessionProfile(ACME, profileType)}${search}`,
  );

const findRow = async (title: string) => {
  const cell = await screen.findByRole("button", {
    name: `Open "${title}" profile details`,
  });
  const row = cell.closest("tr");

  assert(row);

  return within(row);
};

/** The open side panel, found by the heading `title` it shows. */
const findSidePanel = async (title: string) => {
  const heading = await screen.findByRole("heading", { name: title });
  const panel = heading.closest("aside");

  assert(panel);

  return within(panel);
};

describe("SupportProfilesPage (integration)", () => {
  const user = userEvent.setup();

  assert(packageProfile);
  assert(upgradeProfile);
  assert(rebootProfile);
  assert(removalProfile);
  assert(repositoryProfile);

  beforeEach(() => {
    signIn();
  });

  it("lists the package profiles without actions", async () => {
    renderProfiles("package");

    expect(
      await screen.findByRole("heading", { name: "Package profiles" }),
    ).toBeInTheDocument();

    const row = await findRow(packageProfile.title);

    expect(row.getByText("Global access")).toBeInTheDocument();
    expect(
      row.getByText(`${packageProfile.computers.constrained.length} instances`),
    ).toBeInTheDocument();
    expect(row.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /actions/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add/i }),
    ).not.toBeInTheDocument();
  });

  it("opens a package profile's details and constraints, read-only", async () => {
    renderProfiles("package");

    await user.click(
      await screen.findByRole("button", {
        name: `Open "${packageProfile.title}" profile details`,
      }),
    );

    const panel = await findSidePanel(packageProfile.title);

    expect(panel.getByText(packageProfile.description)).toBeInTheDocument();
    expect(panel.getByText("Association")).toBeInTheDocument();
    expect(
      panel.queryByRole("button", { name: /edit|duplicate|remove/i }),
    ).not.toBeInTheDocument();

    await user.click(panel.getByRole("tab", { name: "Package constraints" }));

    expect(
      await panel.findByText(packageProfile.constraints[0]?.package ?? ""),
    ).toBeInTheDocument();
  });

  it("filters the list by search", async () => {
    renderProfiles("package");

    await findRow(packageProfile.title);

    await user.type(screen.getByRole("searchbox"), "web-profile{enter}");

    await waitFor(() => {
      expect(
        screen.queryByRole("button", {
          name: `Open "${packageProfile.title}" profile details`,
        }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", {
        name: 'Open "web-profile" profile details',
      }),
    ).toBeInTheDocument();
  });

  it("lists the upgrade profiles and opens one with its schedule", async () => {
    renderProfiles("upgrade");

    expect(
      await screen.findByRole("heading", { name: "Upgrade profiles" }),
    ).toBeInTheDocument();

    await user.click(
      (await findRow(upgradeProfile.title)).getByRole("button", {
        name: `Open "${upgradeProfile.title}" profile details`,
      }),
    );

    const panel = await findSidePanel(upgradeProfile.title);

    expect(await panel.findByText("Running schedule")).toBeInTheDocument();
  });

  it("lists the reboot profiles with their next restart", async () => {
    renderProfiles("reboot");

    expect(
      await screen.findByRole("heading", { name: "Reboot profiles" }),
    ).toBeInTheDocument();
    await findRow(rebootProfile.title);

    expect(
      screen
        .getAllByRole("columnheader")
        .map((header) => header.textContent?.trim()),
    ).toEqual(["Profile name", "Access group", "Associated", "Next restart"]);
  });

  it.each(["reboot", "removal"])(
    "lists the %s profiles despite another type's profile name in the URL",
    async (profileType) => {
      // Left behind when the side panel was open on a repository profile.
      renderProfiles(
        profileType,
        `?sidePath=view&name=${repositoryProfile.name}`,
      );

      expect(
        await screen.findByRole("heading", {
          name: `${profileType[0]?.toUpperCase()}${profileType.slice(1)} profiles`,
        }),
      ).toBeInTheDocument();
      expect(await screen.findAllByRole("row")).not.toHaveLength(0);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    },
  );

  it("lists the removal profiles with their timeframe", async () => {
    renderProfiles("removal");

    expect(
      await screen.findByRole("heading", { name: "Removal profiles" }),
    ).toBeInTheDocument();

    const row = await findRow(removalProfile.title);

    expect(
      row.getByText(`${removalProfile.days_without_exchange} days`),
    ).toBeInTheDocument();
  });

  it("lists the repository profiles and opens one with its sources", async () => {
    renderProfiles("repository");

    expect(
      await screen.findByRole("heading", { name: "Repository profiles" }),
    ).toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: repositoryProfile.title }),
    );

    const panel = await findSidePanel(repositoryProfile.title);

    expect(panel.getByText("Sources")).toBeInTheDocument();
    expect(
      panel.queryByRole("button", { name: /edit|remove/i }),
    ).not.toBeInTheDocument();
  });

  it("opens the first profile page for an unknown type", async () => {
    renderProfiles("no-such-type");

    expect(
      await screen.findByRole("heading", { name: "Repository profiles" }),
    ).toBeInTheDocument();
  });
});
