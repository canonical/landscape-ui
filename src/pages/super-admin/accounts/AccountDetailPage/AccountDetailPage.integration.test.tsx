import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { API_URL, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { StaffAccount } from "@/features/super-admin";
import date from "@/libs/date";
import { PATHS, ROUTES } from "@/libs/routes";
import { authResponse } from "@/tests/mocks/auth";
import { features } from "@/tests/mocks/features";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import AccountDetailPage from "./AccountDetailPage";

const ROUTE_PATTERN = `/${PATHS.superAdmin.root}/${PATHS.superAdmin.account}`;

const getAccount = (name: string): StaffAccount => {
  const account = createStaffAccounts().find(
    (staffAccount) => staffAccount.account === name,
  );

  assert(account);

  return account;
};

const getFeatureName = (databaseKey: number): string => {
  const feature = features.find(
    ({ database_key }) => database_key === databaseKey,
  );

  assert(feature);

  return feature.name;
};

/** Signs in a staff member with `globalRoles`, for the app and for the mock API. */
const signInAs = (globalRoles: string[]) => {
  setStaffGlobalRoles(globalRoles);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({ ...authResponse, global_roles: globalRoles }),
    ),
  );
};

const renderAccount = (name: string, tab?: string) =>
  renderWithProviders(
    <AccountDetailPage />,
    undefined,
    ROUTES.superAdmin.account(name, tab ? { tab } : undefined),
    ROUTE_PATTERN,
  );

const findSection = async (title: string) => {
  const heading = await screen.findByRole("heading", { name: title });
  const section = heading.closest("section");

  assert(section);

  return within(section);
};

/** Records the body of every account PATCH, then lets the mock API handle it. */
const recordPatches = (name: string): unknown[] => {
  const bodies: unknown[] = [];

  server.use(
    http.patch(`${API_URL}accounts/${name}`, async ({ request }) => {
      bodies.push(await request.clone().json());
    }),
  );

  return bodies;
};

/** A feature's switch, once it is usable: auth has loaded and no change is in flight. */
const findEnabledSwitch = async (featureName: string) => {
  await waitFor(() => {
    expect(screen.getByRole("switch", { name: featureName })).toBeEnabled();
  });

  return screen.getByRole("switch", { name: featureName });
};

describe("AccountDetailPage (integration)", () => {
  const user = userEvent.setup();

  /** Clicks a feature's switch and returns the confirmation dialog it opens. */
  const requestChange = async (databaseKey: number) => {
    await user.click(await findEnabledSwitch(getFeatureName(databaseKey)));

    return within(await screen.findByRole("dialog"));
  };

  /** Changes a feature and confirms it. */
  const changeFeature = async (
    databaseKey: number,
    action: "Enable" | "Disable",
  ) => {
    const dialog = await requestChange(databaseKey);

    await user.click(dialog.getByRole("button", { name: action }));
  };

  beforeEach(() => {
    signInAs(["AccountManager"]);
  });

  it("renders the tabs with Info selected", async () => {
    renderAccount("acme");

    const tabs = await screen.findAllByRole("tab");

    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Info",
      "Administrators",
      "Licenses",
      "Feature flags",
    ]);
    expect(screen.getByRole("tab", { name: "Info" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders the status and the details of the account on the Info tab", async () => {
    // Its subdomain differs from its name, so each can be found by its text.
    const account = getAccount("jane-free-1");

    renderAccount(account.account);

    expect(
      await screen.findByRole("heading", { name: account.company, level: 2 }),
    ).toBeInTheDocument();

    const status = await findSection("Status");

    expect(status.getByText("Active")).toBeInTheDocument();
    expect(status.getByText(String(account.computers))).toBeInTheDocument();
    expect(
      status.getByText(
        date(account.last_login_time).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();

    const details = await findSection("Account details");

    expect(details.getByText(account.account)).toBeInTheDocument();
    expect(details.getByText(account.company)).toBeInTheDocument();
    expect(details.getByText(String(account.subdomain))).toBeInTheDocument();
    expect(
      details.getByText(
        date(account.creation_time).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
  });

  it("falls back to the Info tab for an unknown tab", async () => {
    renderAccount("acme", "no-such-tab");

    expect(await screen.findByRole("tab", { name: "Info" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("heading", { name: "Status" })).toBeInTheDocument();
  });

  it("links back to the accounts list", async () => {
    renderAccount("acme");

    expect(
      await screen.findByRole("link", { name: "Accounts" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.accounts());
  });

  it("switches to the Administrators tab", async () => {
    const account = getAccount("acme");
    const [administrator] = account.administrators;

    assert(administrator);

    renderAccount(account.account);

    await user.click(
      await screen.findByRole("tab", { name: "Administrators" }),
    );

    const panel = within(screen.getByRole("tabpanel"));

    expect(await panel.findByText(administrator.name)).toBeInTheDocument();
    expect(panel.getByText(administrator.email)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Administrators" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.queryByRole("heading", { name: "Status" }),
    ).not.toBeInTheDocument();
  });

  it("renders the licenses on the Licenses tab", async () => {
    const account = getAccount("acme");
    const [license] = account.licenses;

    assert(license);

    renderAccount(account.account, "licenses");

    const panel = within(await screen.findByRole("tabpanel"));

    expect(panel.getByText(license.type)).toBeInTheDocument();
    expect(panel.getByText(String(license.seats))).toBeInTheDocument();
    expect(
      panel.getByText(date(license.expires).format(DISPLAY_DATE_TIME_FORMAT)),
    ).toBeInTheDocument();
  });

  it("renders the empty message for an account without licenses", async () => {
    renderAccount("initech", "licenses");

    expect(
      await screen.findByText("This account has no licenses."),
    ).toBeInTheDocument();
  });

  it("renders a disabled account with its reason and without a last login", async () => {
    const account = getAccount("initech");

    renderAccount(account.account);

    const status = await findSection("Status");

    expect(status.getByText("Disabled")).toBeInTheDocument();
    expect(
      status.getByText(String(account.disabled_reason)),
    ).toBeInTheDocument();
    expect(status.getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });

  it("takes the feature state from the account, not from the registry's enabled bit", async () => {
    const account = getAccount("acme");

    renderAccount(account.account, "feature-flags");

    // Every registry entry is `enabled: true` for the caller's own account.
    for (const feature of features) {
      const featureSwitch = await screen.findByRole("switch", {
        name: feature.name,
      });

      if (account.enabled_features.includes(feature.database_key)) {
        expect(featureSwitch).toBeChecked();
      } else {
        expect(featureSwitch).not.toBeChecked();
      }
    }
  });

  it("asks for confirmation before changing a feature", async () => {
    const account = getAccount("acme");
    const patches = recordPatches(account.account);

    renderAccount(account.account, "feature-flags");

    const dialog = await requestChange(5);

    expect(
      dialog.getByRole("heading", { name: `Enable ${getFeatureName(5)}` }),
    ).toBeInTheDocument();
    expect(dialog.getByText(account.company)).toBeInTheDocument();
    expect(patches).toEqual([]);
    expect(
      screen.getByRole("switch", { name: getFeatureName(5) }),
    ).not.toBeChecked();
  });

  it("changes nothing when the confirmation is cancelled", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme", "feature-flags");

    const dialog = await requestChange(4);

    await user.click(dialog.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(patches).toEqual([]);
    expect(
      screen.getByRole("switch", { name: getFeatureName(4) }),
    ).toBeChecked();
  });

  it("sends the full replacement set when a feature is enabled", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme", "feature-flags");

    await changeFeature(5, "Enable");

    await waitFor(() => {
      expect(patches).toEqual([{ enabled_features: [4, 5, 7] }]);
    });
    await waitFor(() => {
      expect(
        screen.getByRole("switch", { name: getFeatureName(5) }),
      ).toBeChecked();
    });
  });

  it("sends the full replacement set when a feature is disabled", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme", "feature-flags");

    await changeFeature(4, "Disable");

    await waitFor(() => {
      expect(patches).toEqual([{ enabled_features: [7] }]);
    });
    await waitFor(() => {
      expect(
        screen.getByRole("switch", { name: getFeatureName(4) }),
      ).not.toBeChecked();
    });
  });

  it("leaves out enabled keys the registry no longer knows", async () => {
    const account = getAccount("acme");
    const patches: unknown[] = [];

    // 9 was retired from the registry; the server rejects it in a PATCH.
    server.use(
      http.get(`${API_URL}accounts/acme`, () =>
        HttpResponse.json({ ...account, enabled_features: [4, 9] }),
      ),
      http.patch(`${API_URL}accounts/acme`, async ({ request }) => {
        patches.push(await request.clone().json());

        return HttpResponse.json(account);
      }),
    );

    renderAccount("acme", "feature-flags");

    await changeFeature(5, "Enable");

    await waitFor(() => {
      expect(patches).toEqual([{ enabled_features: [4, 5] }]);
    });
  });

  it("restores the switch when the change is rejected", async () => {
    server.use(
      http.patch(`${API_URL}accounts/acme`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Server error" },
          { status: 500 },
        ),
      ),
    );

    renderAccount("acme", "feature-flags");

    await changeFeature(5, "Enable");

    expect(await screen.findByText("Server error")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByRole("switch", { name: getFeatureName(5) }),
      ).not.toBeChecked();
    });
  });

  it("disables the switches for read-tier staff", async () => {
    signInAs(["SupportProvider"]);

    renderAccount("acme", "feature-flags");

    expect(
      await screen.findByText(
        "Only account managers can change feature flags.",
      ),
    ).toBeInTheDocument();

    for (const feature of features) {
      expect(
        await screen.findByRole("switch", { name: feature.name }),
      ).toBeDisabled();
    }
  });

  it("handles an account that does not exist", async () => {
    renderAccount("no-such-account");

    expect(await screen.findByText("Account not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to accounts" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.accounts());
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });
});
