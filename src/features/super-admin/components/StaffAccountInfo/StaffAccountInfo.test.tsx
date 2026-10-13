import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useAuth from "@/hooks/useAuth";
import date from "@/libs/date";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { API_URL } from "@/constants";
import { authResponse } from "@/tests/mocks/auth";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import type { FC, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import StaffAccountInfo from "./StaffAccountInfo";

// Super admin mode only exists on SaaS deployments.
vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

const MISSING_VALUES = 3;
const ADMINISTRATOR_LIMIT = 37;
const ATTACHMENT_SIZE = 2048;

const staffAccounts = createStaffAccounts();

// The subdomain differs from the name, so each can be found by its text.
const activeAccount = staffAccounts.find(
  ({ account, disabled, subdomain, last_login_time }) =>
    !disabled && subdomain && subdomain !== account && last_login_time,
);
const disabledAccount = staffAccounts.find(({ disabled }) => disabled);

/**
 * Renders once the signed-in user's roles are in, the way the account page
 * does: `HeaderActions` lays out its buttons from the actions it first sees.
 */
const WhenSignedIn: FC<{ readonly children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return user ? children : null;
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

describe("StaffAccountInfo", () => {
  assert(activeAccount);
  assert(disabledAccount);

  it("renders the title, status and details of an active account", () => {
    renderWithProviders(<StaffAccountInfo staffAccount={activeAccount} />);

    expect(
      screen.getByRole("heading", { name: activeAccount.company, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Status" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Account details" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText(activeAccount.account)).toBeInTheDocument();
    expect(
      screen.getByText(String(activeAccount.subdomain)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(String(activeAccount.computers)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        date(activeAccount.creation_time).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        date(activeAccount.last_login_time).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Disabled reason")).not.toBeInTheDocument();
  });

  it("offers Enter account to a support provider", async () => {
    signInAs(["SupportProvider"]);

    renderWithProviders(
      <WhenSignedIn>
        <StaffAccountInfo staffAccount={activeAccount} />
      </WhenSignedIn>,
    );

    expect(
      await screen.findByRole("button", { name: "Enter account" }),
    ).toBeEnabled();
  });

  it("hides Enter account from an account manager without the support role", async () => {
    signInAs(["AccountManager"]);

    renderWithProviders(
      <WhenSignedIn>
        <StaffAccountInfo staffAccount={activeAccount} />
      </WhenSignedIn>,
    );

    expect(
      await screen.findByRole("button", { name: "Edit" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Enter account" }),
    ).not.toBeInTheDocument();
  });

  it("renders why an account is disabled", () => {
    renderWithProviders(<StaffAccountInfo staffAccount={disabledAccount} />);

    expect(screen.getByText("Disabled")).toBeInTheDocument();
    expect(screen.getByText("Disabled reason")).toBeInTheDocument();
    expect(
      screen.getByText(String(disabledAccount.disabled_reason)),
    ).toBeInTheDocument();
  });

  it("renders placeholders for a missing subdomain, Salesforce key and last login", () => {
    renderWithProviders(
      <StaffAccountInfo
        staffAccount={{
          ...activeAccount,
          subdomain: null,
          salesforce_account_key: null,
          last_login_time: null,
        }}
      />,
    );

    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(MISSING_VALUES);
  });

  it("renders the Salesforce key and the limits", () => {
    renderWithProviders(
      <StaffAccountInfo
        staffAccount={{
          ...activeAccount,
          salesforce_account_key: "1-001A1B2C3D4E5F0",
          max_people_count: ADMINISTRATOR_LIMIT,
          max_attachment_size: ATTACHMENT_SIZE,
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Limits" })).toBeInTheDocument();
    expect(screen.getByText("1-001A1B2C3D4E5F0")).toBeInTheDocument();
    expect(screen.getByText(String(ADMINISTRATOR_LIMIT))).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();
  });

  it("hides Edit without write access", () => {
    renderWithProviders(<StaffAccountInfo staffAccount={activeAccount} />);

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });
});
