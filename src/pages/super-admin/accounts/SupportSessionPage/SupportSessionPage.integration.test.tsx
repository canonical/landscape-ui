import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import AccountDetailPage from "@/pages/super-admin/accounts/AccountDetailPage";
import SuperAdminPage from "@/pages/super-admin/SuperAdminPage";
import { authResponse, authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import { StrictMode } from "react";
import { AuthGuard } from "@/components/guards/AuthGuard";
import { SuperAdminGuard } from "@/components/guards/SuperAdminGuard";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import type { FC, ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import SupportSessionPage from "./SupportSessionPage";

const SUPER_ADMIN = `/${PATHS.superAdmin.root}`;
const SLOW_SWITCH_MS = 1000;

// A second mock account the signed-in user is not a member of.
const GLOBEX = "globex";
const GLOBEX_TITLE = "Globex Corporation";

// The mock "acme" account: the signed-in user is not a member of it.
const ACME = "acme";
const ACME_TITLE = "ACME Corp";

interface SessionOptions {
  globalRoles?: string[];
  currentAccount?: string;
  /** The person's own accounts; defaults to the fixture's two. */
  accounts?: typeof authUser.accounts;
}

/** Signs in with the given session, for the app and for the mock API. */
const signInWith = ({
  globalRoles = ["SupportProvider"],
  currentAccount = authUser.current_account,
  accounts = authUser.accounts,
}: SessionOptions = {}) => {
  setStaffGlobalRoles(globalRoles);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({
        ...authResponse,
        accounts,
        current_account: currentAccount,
        global_roles: globalRoles,
      }),
    ),
  );
};

interface SwitchOptions {
  /** How long the first switch takes. */
  firstDelayMs?: number;
  /** Whether the first switch is refused once it settles. */
  refuseFirst?: boolean;
}

/**
 * Records the body of every account switch, then lets the mock API handle
 * it, the first one as `options` say.
 */
const recordSwitches = ({
  firstDelayMs = 0,
  refuseFirst = false,
}: SwitchOptions = {}): unknown[] => {
  const bodies: unknown[] = [];

  server.use(
    http.post(`${API_URL}switch-account`, async ({ request }) => {
      bodies.push(await request.clone().json());

      if (bodies.length > 1) {
        return undefined;
      }

      await delay(firstDelayMs);

      return refuseFirst
        ? HttpResponse.json(
            { error: "Unavailable", message: "Try again later." },
            { status: 503 },
          )
        : undefined;
    }),
  );

  return bodies;
};

/** Records the name of every staff account looked up, then lets the mock API answer. */
const recordLookups = (): string[] => {
  const names: string[] = [];

  server.use(
    http.get(`${API_URL}accounts/:name`, ({ params }) => {
      names.push(String(params.name));
    }),
  );

  return names;
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

interface RenderOptions {
  strict?: boolean;
  /** Rendered next to the routes, for driving the URL. */
  extra?: ReactNode;
}

/** The super admin routes as the app declares them, with a stand-in events log. */
const renderApp = (
  initialPath: string,
  { strict = false, extra = null }: RenderOptions = {},
) =>
  renderWithProviders(
    <>
      <Routes>
        <Route
          path={SUPER_ADMIN}
          element={
            // The guards mount the session once the user is known, as the app
            // does; the StrictMode case depends on that.
            <AuthGuard requireAccount={false}>
              <SuperAdminGuard>
                <Outlet />
              </SuperAdminGuard>
            </AuthGuard>
          }
        >
          <Route
            path={PATHS.superAdmin.session}
            element={<SupportSessionPage />}
          >
            <Route
              index
              element={
                <Navigate to={PATHS.superAdmin.sessionEventsLog} replace />
              }
            />
            <Route
              path={PATHS.superAdmin.sessionEventsLog}
              element={<h1>Events log page</h1>}
            />
          </Route>
          {/* The layout that returns a session left behind to its owner. */}
          <Route element={<SuperAdminPage />}>
            <Route
              path={PATHS.superAdmin.account}
              element={<AccountDetailPage />}
            />
          </Route>
        </Route>
      </Routes>
      {extra}
    </>,
    undefined,
    initialPath,
    undefined,
    strict ? StrictMode : undefined,
  );

const findSupportBar = async () =>
  within(await screen.findByRole("region", { name: "Support session" }));

describe("SupportSessionPage (integration)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    signInWith();
  });

  it("enters the account from its page and opens its events log", async () => {
    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.account(ACME));

    await user.click(
      await screen.findByRole("button", { name: "Enter account" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Events log page" }),
    ).toBeInTheDocument();
    expect(switches).toEqual([{ account_name: ACME }]);

    const bar = await findSupportBar();

    expect(bar.getByText(ACME_TITLE)).toBeInTheDocument();
  });

  it("enters the account when its session is opened by URL", async () => {
    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.session(ACME));

    expect(
      await screen.findByRole("heading", { name: "Events log page" }),
    ).toBeInTheDocument();
    expect(switches).toEqual([{ account_name: ACME }]);
  });

  it("enters the account once when its effects run twice", async () => {
    // StrictMode doubles the mount effect in development; the real server
    // saw two switches back to back from a deep link.
    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.session(ACME), { strict: true });

    expect(
      await screen.findByRole("heading", { name: "Events log page" }),
    ).toBeInTheDocument();
    expect(switches).toEqual([{ account_name: ACME }]);
  });

  it.each([
    { outcome: "settles", refuseFirst: false },
    { outcome: "is refused", refuseFirst: true },
  ])(
    "enters the account the URL moved to once the switch into another $outcome",
    async ({ refuseFirst }) => {
      const switches = recordSwitches({
        firstDelayMs: SLOW_SWITCH_MS,
        refuseFirst,
      });
      const lookups = recordLookups();

      renderApp(ROUTES.superAdmin.session(ACME), {
        extra: <GoTo to={ROUTES.superAdmin.session(GLOBEX)} />,
      });

      // The first switch is still on its way when the address changes, and
      // the new account is looked up before it settles.
      await waitFor(() => {
        expect(switches).toEqual([{ account_name: ACME }]);
      });
      await user.click(screen.getByRole("button", { name: /^Go to/ }));
      await waitFor(() => {
        expect(lookups).toContain(GLOBEX);
      });

      const bar = within(
        await screen.findByRole(
          "region",
          { name: "Support session" },
          { timeout: SLOW_SWITCH_MS * 3 },
        ),
      );

      expect(bar.getByText(GLOBEX_TITLE)).toBeInTheDocument();
      expect(switches).toEqual([
        { account_name: ACME },
        { account_name: GLOBEX },
      ]);
      expect(screen.queryByText(/Could not enter/)).not.toBeInTheDocument();
    },
  );

  it("does not switch again when the session is already in the account", async () => {
    signInWith({ currentAccount: ACME });

    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    expect(
      await screen.findByRole("heading", { name: "Events log page" }),
    ).toBeInTheDocument();
    expect(switches).toEqual([]);
  });

  it("frames the account's pages with its own navigation", async () => {
    signInWith({ currentAccount: ACME });

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    const sidebar = within(await screen.findByRole("banner"));

    expect(await sidebar.findByText(ACME_TITLE)).toBeInTheDocument();
    expect(sidebar.getByText("Organization")).toBeInTheDocument();
    expect(sidebar.getByRole("link", { name: "Events log" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    for (const placeholder of ["Profiles", "Org. settings"]) {
      expect(
        sidebar.getByText(placeholder).closest("[aria-disabled]"),
      ).toHaveAttribute("aria-disabled", "true");
      expect(
        sidebar.queryByRole("link", { name: placeholder }),
      ).not.toBeInTheDocument();
    }

    // Nothing about the staff member.
    expect(
      sidebar.queryByRole("button", { name: "Sign out" }),
    ).not.toBeInTheDocument();
    expect(sidebar.queryByText(authUser.name)).not.toBeInTheDocument();
    expect(
      sidebar.queryByRole("combobox", { name: "Organization" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the logo inside the session", async () => {
    signInWith({ currentAccount: ACME });

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    await screen.findByRole("banner");

    // The desktop and the mobile header each carry one.
    const logos = screen.getAllByRole("link", { name: /landscape/i });

    expect(logos).toHaveLength(2);
    for (const logo of logos) {
      expect(logo).toHaveAttribute("href", ROUTES.superAdmin.session(ACME));
    }
  });

  it("offers to try again when the session cannot be returned after exiting", async () => {
    signInWith({ currentAccount: ACME });
    server.use(
      http.post(`${API_URL}switch-account`, () =>
        HttpResponse.json(
          { error: "Unavailable", message: "Try again later." },
          { status: 503 },
        ),
      ),
    );

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    const bar = await findSupportBar();

    await user.click(bar.getByRole("button", { name: "Exit to super admin" }));

    expect(
      await screen.findByText(`Could not leave ${ACME}`),
    ).toBeInTheDocument();
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Support session" }),
    ).not.toBeInTheDocument();
  });

  it("exits to the account's page, back in the person's own account", async () => {
    signInWith({ currentAccount: ACME });

    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    const bar = await findSupportBar();

    await user.click(bar.getByRole("button", { name: "Exit to super admin" }));

    expect(
      await screen.findByRole("heading", { name: ACME_TITLE, level: 2 }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(switches).toEqual([{ account_name: authUser.current_account }]);
    });
    expect(
      screen.queryByRole("region", { name: "Support session" }),
    ).not.toBeInTheDocument();
  });

  it("exits without switching for staff who have no account of their own", async () => {
    signInWith({ currentAccount: ACME, accounts: [] });

    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.sessionEventsLog(ACME));

    const bar = await findSupportBar();

    await user.click(bar.getByRole("button", { name: "Exit to super admin" }));

    expect(
      await screen.findByRole("heading", { name: ACME_TITLE, level: 2 }),
    ).toBeInTheDocument();
    expect(switches).toEqual([]);
  });

  it("reports an account it could not enter", async () => {
    server.use(
      http.post(`${API_URL}switch-account`, () =>
        HttpResponse.json(
          {
            error: "UnknownAccountError",
            message: "The specified account couldn't be found.",
          },
          { status: 400 },
        ),
      ),
    );

    renderApp(ROUTES.superAdmin.session(ACME));

    expect(
      await screen.findByText(`Could not enter ${ACME_TITLE}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The specified account couldn't be found."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to the account" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.account(ACME));
    expect(
      screen.queryByRole("region", { name: "Support session" }),
    ).not.toBeInTheDocument();
  });

  it("handles an account that does not exist without switching", async () => {
    const switches = recordSwitches();

    renderApp(ROUTES.superAdmin.session("no-such-account"));

    expect(await screen.findByText("Account not found")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.queryByRole("region", { name: "Support session" }),
      ).not.toBeInTheDocument();
    });
    expect(switches).toEqual([]);
  });
});
