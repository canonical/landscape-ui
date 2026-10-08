import { ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
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

  it("opens the account's support session from its menu", async () => {
    renderWithProviders(
      <>
        <StaffAccountsListActions staffAccount={staffAccount} />
        <LocationDisplay />
      </>,
    );

    await user.click(
      screen.getByRole("button", { name: `${account} actions` }),
    );

    expect(screen.getAllByRole("menuitem")).toHaveLength(1);

    await user.click(
      screen.getByRole("menuitem", { name: `Enter ${account}` }),
    );

    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.session(account),
    );
  });
});
