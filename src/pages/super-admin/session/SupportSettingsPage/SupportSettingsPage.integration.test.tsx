import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import SupportSessionPage from "@/pages/super-admin/accounts/SupportSessionPage";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { administrators } from "@/tests/mocks/administrators";
import { authResponse } from "@/tests/mocks/auth";
import { invitations } from "@/tests/mocks/invitations";
import { preferences } from "@/tests/mocks/organisationPreferences";
import { roles } from "@/tests/mocks/roles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { ErrorBoundary } from "@sentry/react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import SupportSettingsPage from "./SupportSettingsPage";

const ACME = "acme";

const [administrator] = administrators;
const [invitation] = invitations;
const [role] = roles;
const childAccessGroup = accessGroups.find(({ parent }) => !!parent);

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

const renderSettings = (setting: string) =>
  renderWithProviders(
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Routes>
        <Route
          path={`/${PATHS.superAdmin.root}/${PATHS.superAdmin.session}`}
          element={<SupportSessionPage />}
        >
          <Route
            path={PATHS.superAdmin.sessionSettings}
            element={<SupportSettingsPage />}
          />
          <Route
            path={PATHS.superAdmin.sessionSetting}
            element={<SupportSettingsPage />}
          />
        </Route>
      </Routes>
    </ErrorBoundary>,
    undefined,
    ROUTES.superAdmin.sessionSetting(ACME, setting),
  );

const findRow = async (text: string) => {
  const row = (await screen.findByText(text)).closest("tr");

  assert(row);

  return within(row);
};

describe("SupportSettingsPage (integration)", () => {
  const user = userEvent.setup();

  assert(administrator);
  assert(invitation);
  assert(role);
  assert(childAccessGroup);

  beforeEach(() => {
    setEndpointStatus("default");
    signIn();
  });

  it("treats a blank registration key as none", async () => {
    server.use(
      http.get(`${API_URL}preferences`, () =>
        HttpResponse.json({
          ...preferences,
          registration_password: "",
          // The only "No" on the page is then the registration key's.
          auto_register_new_computers: true,
        }),
      ),
    );

    renderSettings("general");

    expect(await screen.findByText("Use registration key")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.queryByText("Registration key")).not.toBeInTheDocument();
  });

  it("counts every pending invitation in the Invites tab", async () => {
    server.use(
      http.get(`${API_URL}invitations`, () =>
        HttpResponse.json({
          count: 25,
          next: null,
          previous: null,
          results: [invitation],
        }),
      ),
    );

    renderSettings("administrators");

    expect(
      await screen.findByRole("tab", { name: /Invites/ }),
    ).toHaveTextContent("25");
  });

  it("surfaces a failed access-group request instead of an empty list", async () => {
    setEndpointStatus({ status: "error", path: "GetAccessGroups" });

    renderSettings("access-groups");

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.queryByText("This account has no access groups."),
    ).not.toBeInTheDocument();
  });

  it("shows the account's preferences as read-only values", async () => {
    renderSettings("general");

    expect(
      await screen.findByRole("heading", { name: "General" }),
    ).toBeInTheDocument();
    expect(await screen.findByText(preferences.title)).toBeInTheDocument();
    expect(screen.getByText(ACME)).toBeInTheDocument();
    expect(screen.getByText("Use registration key")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /save/i }),
    ).not.toBeInTheDocument();
  });

  it("lists the administrators and the pending invitations without actions", async () => {
    renderSettings("administrators");

    expect(
      await screen.findByRole("heading", { name: "Administrators" }),
    ).toBeInTheDocument();

    const row = await findRow(administrator.email);

    expect(row.getByText(administrator.name)).toBeInTheDocument();
    expect(row.getByText(administrator.roles.join(", "))).toBeInTheDocument();
    expect(row.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /invite/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Invites/ }));

    expect(screen.getByRole("tab", { name: /Invites/ })).toHaveAttribute(
      "aria-controls",
      screen.getByRole("tabpanel").id,
    );

    const invitationRow = await findRow(invitation.email);

    expect(invitationRow.getByText(invitation.name)).toBeInTheDocument();
    expect(invitationRow.queryByRole("button")).not.toBeInTheDocument();
  });

  it("lists the roles with their permissions, without actions", async () => {
    renderSettings("roles");

    expect(
      await screen.findByRole("heading", { name: "Roles" }),
    ).toBeInTheDocument();

    const row = await findRow(role.name);

    expect(row.getByText(String(role.persons.length))).toBeInTheDocument();
    expect(row.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add role/i }),
    ).not.toBeInTheDocument();
  });

  it("lists the access groups with their parents, without actions", async () => {
    renderSettings("access-groups");

    expect(
      await screen.findByRole("heading", { name: "Access groups" }),
    ).toBeInTheDocument();

    const row = await findRow(childAccessGroup.title);
    const parent = accessGroups.find(
      ({ name }) => name === childAccessGroup.parent,
    );

    assert(parent);

    expect(row.getByText(parent.title)).toBeInTheDocument();
    expect(row.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add access group/i }),
    ).not.toBeInTheDocument();
  });

  it("opens the first settings page for an unknown setting", async () => {
    renderSettings("no-such-setting");

    expect(
      await screen.findByRole("heading", { name: "General" }),
    ).toBeInTheDocument();
  });
});
