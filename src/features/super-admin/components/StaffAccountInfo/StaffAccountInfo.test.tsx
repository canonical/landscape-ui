import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StaffAccountInfo from "./StaffAccountInfo";

const staffAccounts = createStaffAccounts();

// The subdomain differs from the name, so each can be found by its text.
const activeAccount = staffAccounts.find(
  ({ account, disabled, subdomain, last_login_time }) =>
    !disabled && subdomain && subdomain !== account && last_login_time,
);
const disabledAccount = staffAccounts.find(({ disabled }) => disabled);

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

  it("offers Enter account as a disabled placeholder", () => {
    renderWithProviders(<StaffAccountInfo staffAccount={activeAccount} />);

    expect(
      screen.getByRole("button", { name: "Enter account" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("renders why an account is disabled", () => {
    renderWithProviders(<StaffAccountInfo staffAccount={disabledAccount} />);

    expect(screen.getByText("Disabled")).toBeInTheDocument();
    expect(screen.getByText("Disabled reason")).toBeInTheDocument();
    expect(
      screen.getByText(String(disabledAccount.disabled_reason)),
    ).toBeInTheDocument();
  });

  it("renders placeholders for a missing subdomain and last login", () => {
    renderWithProviders(
      <StaffAccountInfo
        staffAccount={{
          ...activeAccount,
          subdomain: null,
          last_login_time: null,
        }}
      />,
    );

    expect(screen.getAllByText(NO_DATA_TEXT)).toHaveLength(2);
  });
});
