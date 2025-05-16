import "@/tests/matcher";
import { screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import UserPanelActionButtons from "./UserPanelActionButtons";
import { users } from "@/tests/mocks/user";
import { getSelectedUsers } from "../UserPanelHeader/helpers";

const userData = {
  empty: [],
  single: {
    unlockedUser: users.find((user) => user.enabled)?.uid ?? 0,
    lockedUser: users.find((user) => !user.enabled)?.uid ?? 0,
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
    it("renders table buttons", () => {
      const { container } = renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, userData.empty)}
          handleClearSelection={vi.fn()}
        />,
      );
      expect(container).toHaveTexts(tableUserButtons);
    });

    describe("Check button disabled statuses", () => {
      it("renders buttons disabled when no users selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(users, userData.empty)}
            handleClearSelection={vi.fn()}
          />,
        );

        for (const button of tableUserButtons) {
          const actionButton = screen.getByRole("button", { name: button });
          if (button !== "Add user") {
            expect(actionButton).toBeDisabled();
          } else {
            expect(actionButton).not.toBeDisabled();
          }
        }
      });

      it("Unlocked button disabled when only unlocked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(
              users,
              userData.multiple.unlockedUsers,
            )}
            handleClearSelection={vi.fn()}
          />,
        );
        const unlockButton = screen.getByRole("button", { name: "Unlock" });
        expect(unlockButton).toBeDisabled();
      });

      it("Lock button disabled when only locked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(
              users,
              userData.multiple.lockedUsers,
            )}
            handleClearSelection={vi.fn()}
          />,
        );
        const lockButton = screen.getByRole("button", { name: "Lock" });
        expect(lockButton).toBeDisabled();
      });

      it("Lock and Unlock enabled when only locked and unlocked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(users, mixedSelectedUsers)}
            handleClearSelection={vi.fn()}
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
    it("renders buttons for held user in sidepanel", () => {
      const { container } = renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [userData.single.lockedUser])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
      );

      expect(container).toHaveTexts(formLockedUserButtons);
    });

    it("renders buttons for unheld user in sidepanel", () => {
      const { container } = renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [
            userData.single.unlockedUser,
          ])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
      );

      expect(container).toHaveTexts(formUnlockedUserButtons);
    });
  });
});
