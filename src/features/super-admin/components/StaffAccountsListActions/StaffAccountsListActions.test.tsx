import { API_URL } from "@/constants";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import StaffAccountsListActions from "./StaffAccountsListActions";

const [staffAccount] = createStaffAccounts();

describe("StaffAccountsListActions", () => {
  const user = userEvent.setup();

  assert(staffAccount);

  const { account } = staffAccount;

  it("enters the account from its menu", async () => {
    setStaffGlobalRoles(["SupportProvider"]);

    const switches: unknown[] = [];

    server.use(
      http.post(`${API_URL}switch-account`, async ({ request }) => {
        switches.push(await request.clone().json());
      }),
    );

    renderWithProviders(
      <StaffAccountsListActions staffAccount={staffAccount} />,
    );

    await user.click(
      screen.getByRole("button", { name: `${account} actions` }),
    );

    expect(screen.getAllByRole("menuitem")).toHaveLength(1);

    await user.click(
      screen.getByRole("menuitem", { name: `Enter ${account}` }),
    );

    await waitFor(() => {
      expect(switches).toEqual([{ account_name: account }]);
    });
  });

  it("reports a switch the server refused under the account's title", async () => {
    setStaffGlobalRoles(["AccountManager"]);

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

    renderWithProviders(
      <StaffAccountsListActions staffAccount={staffAccount} />,
    );

    await user.click(
      screen.getByRole("button", { name: `${account} actions` }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: `Enter ${account}` }),
    );

    expect(
      await screen.findByText(`Could not enter ${staffAccount.company}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The specified account couldn't be found."),
    ).toBeInTheDocument();
  });
});
