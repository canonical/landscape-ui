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
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { ErrorBoundary } from "@sentry/react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { FC, ReactNode } from "react";
import { Route, Routes, useNavigate } from "react-router";
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

/** A button that moves to `to` the way history or an edited address would. */
const GoTo: FC<{ readonly to: string }> = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate(to);
      }}
    >
      Go to {to}
    </button>
  );
};

const renderProfiles = (
  profileType: string,
  search = "",
  extra: ReactNode = null,
) =>
  renderWithProviders(
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
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
      </Routes>
      {extra}
      <LocationDisplay />
    </ErrorBoundary>,
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

  it.each(["package", "upgrade", "reboot", "removal"])(
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

  it("drops the selected profile when the profile type changes", async () => {
    const stalePackageUrl = `${ROUTES.superAdmin.sessionProfile(ACME, "package")}?sidePath=view&name=${repositoryProfile.name}`;

    renderProfiles(
      "repository",
      `?sidePath=view&name=${repositoryProfile.name}`,
      <GoTo to={stalePackageUrl} />,
    );

    await findSidePanel(repositoryProfile.title);

    await user.click(screen.getByRole("button", { name: /^Go to/ }));

    expect(
      await screen.findByRole("heading", { name: "Package profiles" }),
    ).toBeInTheDocument();
    await findRow(packageProfile.title);
    expect(
      screen.queryByRole("heading", { name: repositoryProfile.title }),
    ).not.toBeInTheDocument();
    expect(getLocationDisplay()).not.toHaveTextContent("name=");
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("surfaces a failed profile list instead of an empty one", async () => {
    server.use(
      http.get(`${API_URL}packageprofiles`, () =>
        HttpResponse.json(
          { error: "Forbidden", message: "Forbidden." },
          { status: 403 },
        ),
      ),
    );

    renderProfiles("package");

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.queryByText("This account has no package profiles."),
    ).not.toBeInTheDocument();
  });

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
      panel
        .getAllByRole("columnheader")
        .map((header) => header.textContent?.trim()),
    ).toEqual(["Source", "Deb line", "Fingerprint"]);
    expect(
      panel.queryByRole("button", { name: /edit|remove/i }),
    ).not.toBeInTheDocument();
  });

  it("drops a repository profile selection that a search no longer lists", async () => {
    renderProfiles("repository");

    await user.click(
      await screen.findByRole("button", { name: repositoryProfile.title }),
    );
    await findSidePanel(repositoryProfile.title);

    await user.type(screen.getByRole("searchbox"), "no-such-profile{enter}");

    await waitFor(() => {
      expect(getLocationDisplay()).not.toHaveTextContent("name=");
    });
    expect(
      screen.queryByRole("heading", { name: repositoryProfile.title }),
    ).not.toBeInTheDocument();

    // Clearing the search lists the profile again without reopening it.
    await user.clear(screen.getByRole("searchbox"));
    await user.keyboard("{enter}");

    await screen.findByRole("button", { name: repositoryProfile.title });
    expect(
      screen.queryByRole("heading", { name: repositoryProfile.title }),
    ).not.toBeInTheDocument();
  });

  it("keeps the search and pagination on a page past the last repository profile", async () => {
    renderProfiles("repository", "?currentPage=99");

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.queryByText("This account has no repository profiles."),
    ).not.toBeInTheDocument();
  });

  it("opens the first profile page for an unknown type", async () => {
    renderProfiles("no-such-type");

    expect(
      await screen.findByRole("heading", { name: "Repository profiles" }),
    ).toBeInTheDocument();
  });
});
