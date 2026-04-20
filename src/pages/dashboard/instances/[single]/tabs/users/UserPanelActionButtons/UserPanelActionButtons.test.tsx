import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import "@/tests/matcher";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import { getSelectedUsers } from "../UserPanelHeader/helpers";
import UserPanelActionButtons from "./UserPanelActionButtons";

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
const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;
const routePath = ROUTES.instances.details.single(1);

describe("UserPanelActionButtons", () => {
  beforeEach(() => {
    setScreenSize("lg");
  });

  afterEach(() => {
    resetScreenSize();
  });

  describe("User buttons in table", () => {
    it("renders table buttons", () => {
      const { container } = renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, userData.empty)}
          handleClearSelection={vi.fn()}
        />,
        undefined,
        routePath,
        routePattern,
      );
      expect(container).toHaveTexts(tableUserButtons);
    });

    it("opens add user side panel from table action", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, userData.empty)}
          handleClearSelection={vi.fn()}
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Add user" }));

      expect(
        await screen.findByText("Require password reset"),
      ).toBeInTheDocument();
    });

    describe("Check button disabled statuses", () => {
      it("renders buttons disabled when no users selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(users, userData.empty)}
            handleClearSelection={vi.fn()}
          />,
          undefined,
          routePath,
          routePattern,
        );

        for (const button of tableUserButtons) {
          const actionButton = screen.getByRole("button", { name: button });
          if (button !== "Add user") {
            expect(actionButton).toHaveAttribute("aria-disabled");
          } else {
            expect(actionButton).not.toHaveAttribute("aria-disabled");
            expect(actionButton).toBeEnabled();
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
          undefined,
          routePath,
          routePattern,
        );
        const unlockButton = screen.getByRole("button", { name: "Unlock" });
        expect(unlockButton).toHaveAttribute("aria-disabled");
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
          undefined,
          routePath,
          routePattern,
        );
        const lockButton = screen.getByRole("button", { name: "Lock" });
        expect(lockButton).toHaveAttribute("aria-disabled");
      });

      it("Lock and Unlock enabled when only locked and unlocked users are selected", () => {
        renderWithProviders(
          <UserPanelActionButtons
            selectedUsers={getSelectedUsers(users, mixedSelectedUsers)}
            handleClearSelection={vi.fn()}
          />,
          undefined,
          routePath,
          routePattern,
        );
        const lockButton = screen.getByRole("button", { name: "Lock" });
        const unlockButton = screen.getByRole("button", { name: "Unlock" });
        expect(unlockButton).not.toHaveAttribute("aria-disabled");
        expect(lockButton).not.toHaveAttribute("aria-disabled");
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
        undefined,
        routePath,
        routePattern,
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
        undefined,
        routePath,
        routePattern,
      );

      expect(container).toHaveTexts(formUnlockedUserButtons);
    });

    it("does not render edit button for multiple selected users in sidepanel", () => {
      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, mixedSelectedUsers)}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      expect(
        screen.queryByRole("button", { name: "Edit" }),
      ).not.toBeInTheDocument();
    });

    it("does not render add user button in sidepanel", () => {
      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [userData.single.lockedUser])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      expect(
        screen.queryByRole("button", { name: "Add user" }),
      ).not.toBeInTheDocument();
    });

    it("opens edit user form from sidepanel action", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [userData.single.lockedUser])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Edit" }));

      expect(await screen.findByRole("form")).toBeInTheDocument();
      expect(screen.getByText("Confirm password")).toBeInTheDocument();
    });

    it("opens lock confirmation and submits lock action", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [
            userData.single.unlockedUser,
          ])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Lock" }));
      expect(
        screen.getByRole("heading", { name: /lock user/i }),
      ).toBeInTheDocument();

      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Lock",
        }),
      );
      expect(
        await screen.findByText("Successfully requested to be locked"),
      ).toBeInTheDocument();
    });

    it("submits lock action when clear-selection handler is omitted", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [
            userData.single.unlockedUser,
          ])}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Lock" }));
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Lock",
        }),
      );

      expect(
        await screen.findByText("Successfully requested to be locked"),
      ).toBeInTheDocument();
    });

    it("opens unlock confirmation and submits unlock action", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [userData.single.lockedUser])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Unlock" }));
      expect(
        screen.getByRole("heading", { name: /unlock user/i }),
      ).toBeInTheDocument();

      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Unlock",
        }),
      );
      expect(
        await screen.findByText("Successfully requested to be unlocked"),
      ).toBeInTheDocument();
    });

    it("opens delete confirmation and submits remove action", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [userData.single.lockedUser])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));
      expect(
        screen.getByRole("heading", { name: /delete user/i }),
      ).toBeInTheDocument();

      await user.click(
        screen.getByRole("checkbox", {
          name: "Delete the home folders as well",
        }),
      );
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Delete",
        }),
      );

      expect(
        await screen.findByText("Successfully requested to be removed"),
      ).toBeInTheDocument();
    });

    it("shows error notification when user action fails", async () => {
      const user = userEvent.setup();
      setEndpointStatus({ status: "error", path: "lockUser" });

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, [
            userData.single.unlockedUser,
          ])}
          handleClearSelection={vi.fn()}
          sidePanel
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Lock" }));
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Lock",
        }),
      );

      expect(
        await screen.findByText('The endpoint status is set to "error".'),
      ).toBeInTheDocument();
    });

    it("renders multi-user modal copy and supports closing lock/unlock/delete dialogs", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <UserPanelActionButtons
          selectedUsers={getSelectedUsers(users, mixedSelectedUsers)}
          handleClearSelection={vi.fn()}
        />,
        undefined,
        routePath,
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Lock" }));
      expect(
        screen.getByRole("heading", {
          name: `Lock ${mixedSelectedUsers.length} users`,
        }),
      ).toBeInTheDocument();
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Cancel",
        }),
      );
      expect(
        screen.queryByRole("heading", {
          name: `Lock ${mixedSelectedUsers.length} users`,
        }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Unlock" }));
      expect(
        screen.getByRole("heading", {
          name: `Unlock ${mixedSelectedUsers.length} users`,
        }),
      ).toBeInTheDocument();
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Cancel",
        }),
      );
      expect(
        screen.queryByRole("heading", {
          name: `Unlock ${mixedSelectedUsers.length} users`,
        }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Delete" }));
      expect(
        screen.getByRole("heading", { name: "Delete users" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "This will delete selected users. You can delete their home folders as well.",
        ),
      ).toBeInTheDocument();
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "Cancel",
        }),
      );
      expect(
        screen.queryByRole("heading", { name: "Delete users" }),
      ).not.toBeInTheDocument();
    });
  });
});
