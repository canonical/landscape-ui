import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import UserPanel from "./UserPanel";

describe("UserPanel", () => {
  it("renders UserPanel", async () => {
    renderWithProviders(<UserPanel />);
    await expectLoadingState();

    const user = users[0];
    const username = await screen.findByRole("button", {
      name: `Show details of user ${user.username}`,
    });
    expect(username).toBeInTheDocument();
  });

  it("renders empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<UserPanel />);

    const emptyTableState = await screen.findByText(/no users found/i);
    expect(emptyTableState).toBeInTheDocument();
  });

  it("opens form from empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<UserPanel />);
    await expectLoadingState();

    const addNewUserButton = await screen.findByRole("button", {
      name: /add user/i,
    });
    expect(addNewUserButton).toBeInTheDocument();

    await userEvent.click(addNewUserButton);
    const form = await screen.findByTestId("globalSidePanel");
    expect(form).toBeInTheDocument();
  });

  it("renders filtered list of users", async () => {
    renderWithProviders(<UserPanel />);

    await expectLoadingState();

    for (const user of users) {
      const listUser = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      expect(listUser).toBeInTheDocument();
    }
    const searchBox = await screen.findByRole("searchbox");
    await userEvent.type(searchBox, `user1{enter}`);
    const userFound = await screen.findByRole("button", {
      name: `Show details of user ${users[0].username}`,
    });
    const removedUser = screen.queryByRole("button", {
      name: `Show details of user ${users[1].username}`,
    });
    expect(userFound).toBeInTheDocument();
    expect(removedUser).not.toBeInTheDocument();
  });
});
