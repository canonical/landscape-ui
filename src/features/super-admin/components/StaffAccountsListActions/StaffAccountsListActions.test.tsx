import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import StaffAccountsListActions from "./StaffAccountsListActions";

const [staffAccount] = createStaffAccounts();

describe("StaffAccountsListActions", () => {
  const user = userEvent.setup();

  assert(staffAccount);

  const { account } = staffAccount;

  it("offers Enter account as a disabled placeholder", async () => {
    renderWithProviders(
      <StaffAccountsListActions staffAccount={staffAccount} />,
    );

    await user.click(
      screen.getByRole("button", { name: `${account} actions` }),
    );

    expect(screen.getAllByRole("menuitem")).toHaveLength(1);
    expect(
      screen.getByRole("menuitem", { name: `Enter ${account}` }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});
