import "@/tests/matcher";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import UserPanelActionButtons from "./UserPanelActionButtons";
import { users } from "@/tests/mocks/user";
import { getSelectedUsers } from "../UserPanelHeader/helpers";
import { vi } from "vitest";

const userData = {
  empty: [],
  single: {
    unlockedUser: users.find((user) => user.enabled)!.uid,
    lockedUser: users.find((user) => !user.enabled)!.uid,
  },
  multiple: {
    unlockedUsers: users.filter((user) => user.enabled).map((user) => user.uid),
    lockedUsers: users.filter((user) => !user.enabled).map((user) => user.uid),
  },
};

const mixedSelectedUsers = [
  ...userData.multiple.lockedUsers,
  ...userData.multiple.unlockedUsers,
];

const tableUserButtons = ["Add user", "Lock", "Unlock", "Delete"];
const formLockedUserButtons = ["Unlock", "Edit", "Delete"];
const formUnlockedUserButtons = ["Lock", "Edit", "Delete"];

describe("UserPanelActionButtons", () => {
  describe("User buttons in table", () => {
    it.each(tableUserButtons)("renders %s button", async (button) => {
      renderWithProviders(
        <UserPanelActionButtons
          instanceId={1}
          selectedUsers={getSelectedUsers(users, userData.empty)}
          setSelected={vi.fn()}
        />,
      );
      const actionButton = await screen.findByRole("button", {
        name: button,
      });
      expect(actionButton).toBeInTheDocument();
    });

    describe("Check button disabled statuses", () => {
      it.each(tableUserButtons)(
        "renders disabled %s button when no users selected",
        async (button) => {
          renderWithProviders(
            <UserPanelActionButtons
              instanceId={1}
              selectedUsers={getSelectedUsers(users, userData.empty)}
              setSelected={vi.fn()}
            />,
          );
          const actionButton = await screen.findByRole("button", {
            name: button,
          });
          if (button !== "Add user") {
            expect(actionButton).toBeDisabled();
          } else {
            expect(actionButton).toBeEnabled();
          }
        },
      );

      it("Unlocked button disabled when only unlocked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            instanceId={1}
            selectedUsers={getSelectedUsers(
              users,
              userData.multiple.unlockedUsers,
            )}
            setSelected={vi.fn()}
          />,
        );
        const unlockButton = screen.getByRole("button", { name: "Unlock" });
        expect(unlockButton).toBeDisabled();
      });

      it("Lock button disabled when only locked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            instanceId={1}
            selectedUsers={getSelectedUsers(
              users,
              userData.multiple.lockedUsers,
            )}
            setSelected={vi.fn()}
          />,
        );
        const lockButton = screen.getByRole("button", { name: "Lock" });
        expect(lockButton).toBeDisabled();
      });

      it("Lock and Unlock enabled when only locked and unlocked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            instanceId={1}
            selectedUsers={getSelectedUsers(users, mixedSelectedUsers)}
            setSelected={vi.fn()}
          />,
        );
        const lockButton = screen.getByRole("button", { name: "Lock" });
        const unlockButton = screen.getByRole("button", { name: "Unlock" });
        expect(unlockButton).toBeEnabled();
        expect(lockButton).toBeEnabled();
      });
    });
  });

  describe("User buttons in sidepanel", () => {
    it.each(formLockedUserButtons)(
      "Renders %s button for held user in sidepanel",
      async (button) => {
        renderWithProviders(
          <UserPanelActionButtons
            instanceId={1}
            selectedUsers={getSelectedUsers(users, [
              userData.single.lockedUser,
            ])}
            setSelected={vi.fn()}
            handleEditUser={vi.fn()}
          />,
        );
        const actionButton = await screen.findByRole("button", {
          name: button,
        });
        expect(actionButton).toBeInTheDocument();
      },
    );

    it.each(formUnlockedUserButtons)(
      "Renders %s button for unheld user in sidepanel",
      async (button) => {
        renderWithProviders(
          <UserPanelActionButtons
            instanceId={1}
            selectedUsers={getSelectedUsers(users, [
              userData.single.unlockedUser,
            ])}
            setSelected={vi.fn()}
            handleEditUser={vi.fn()}
          />,
        );
        const actionButton = await screen.findByRole("button", {
          name: button,
        });
        expect(actionButton).toBeInTheDocument();
      },
    );
  });
});
