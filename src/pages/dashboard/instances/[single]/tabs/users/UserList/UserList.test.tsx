import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import { User } from "@/types/User";
import {
  screen,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import UserList from "./UserList";

const userIds = users.map((user) => user.uid);
const unlockedUser = users.find((user) => user.enabled)!;
const lockedUser = users.find((user) => !user.enabled)!;

const props = {
  instanceId: 21,
  users: users,
  selected: [],
  setSelected: vi.fn(),
};

describe("UserList", () => {
  beforeEach(() => {
    renderWithProviders(<UserList {...props} />);
  });
  it("renders a list of users", async () => {
    for (let i = 0; i < users.length; i++) {
      const user = await screen.findByRole("button", {
        name: `Show details of user ${users[i].username}`,
      });

      expect(user).toBeInTheDocument();
    }
  });

  describe("Table Interactions", () => {
    it("shows locked user icon in the user table", async () => {
      expect(lockedUser).toBeDefined();

      const userStatus = screen.getByRole("gridcell", {
        name: `User ${lockedUser.username} status`,
      });
      const iconElement = userStatus.querySelector("i");

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass("p-icon--lock-locked-active");
    });

    it("shows unlocked user icon in the user table", async () => {
      expect(unlockedUser).toBeDefined();

      const userStatus = screen.getByRole("gridcell", {
        name: `User ${unlockedUser.username} status`,
      });
      const iconElement = userStatus.querySelector("i");

      expect(iconElement).toBeInTheDocument();
      expect(iconElement).toHaveClass("p-icon--lock-unlock");
    });

    it("should select all users when clicking ToggleAll checkbox", async () => {
      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await userEvent.click(toggleAllCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith(userIds);
    });

    it.each(userIds)(
      "should select user %s when clicking on its row checkbox",
      async (userId) => {
        const userCheckbox = await screen.findByRole("checkbox", {
          name: `Select user ${users.find((user) => user.uid === userId)!.username}`,
        });
        expect(userCheckbox).toBeInTheDocument();
        await userEvent.click(userCheckbox);

        expect(props.setSelected).toHaveBeenCalledWith([userId]);
      },
    );
  });

  describe("User details sidepanel", () => {
    it("should open side panel when user in table is clicked", async () => {
      const user = await screen.findByRole("button", {
        name: `Show details of user ${users[0].username}`,
      });
      await userEvent.click(user);

      const form = await screen.findByRole("complementary");
      const heading = within(form).getByText("User details");
      expect(heading).toBeVisible();
    });

    it("should show correct locked user side panel action buttons", async () => {
      const user = lockedUser;

      const userTableButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(userTableButton);

      const buttonsNames = ["Unlock", "Edit", "Delete"];
      const form = await screen.findByRole("complementary");

      const loader = await screen.findByText("Loading...");
      expect(loader).toBeInTheDocument();
      await waitForElementToBeRemoved(loader);

      buttonsNames.forEach((buttonName) => {
        const button = within(form).getByText(buttonName);
        expect(button).toBeInTheDocument();
      });
    });

    it("should show correct unlocked user side panel action buttons", async () => {
      const user = unlockedUser;
      const userTableButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(userTableButton);
      const form = await screen.findByRole("complementary");
      const buttonsNames = ["Lock", "Edit", "Delete"];

      buttonsNames.forEach((buttonName) => {
        const button = within(form).getByText(buttonName);
        expect(button).toBeInTheDocument();
      });
    });

    it("should show correct side panel details for a user", async () => {
      const user = unlockedUser;

      const tableUserButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(tableUserButton);

      const form = await screen.findByRole("complementary");
      const primaryGroup = userGroups.find(
        (group) => group.gid === user.primary_gid,
      )!.name;

      const groupsData = userGroups.map((group) => group.name).join(", ");
      const loaded = await screen.findByText(primaryGroup);
      expect(loaded).toBeInTheDocument();
      const getFieldsToCheck = (user: User) => {
        return [
          { label: "username", value: user.username },
          { label: "name", value: user?.name ?? "-" },
          { label: "passphrase", value: "****************" },
          { label: "primary group", value: primaryGroup ?? "-" },
          { label: "additional groups", value: groupsData },
          { label: "location", value: user?.location ?? "-" },
          { label: "home phone", value: user?.home_phone ?? "-" },
          { label: "work phone", value: user?.work_phone ?? "-" },
        ];
      };
      const fieldsToCheck = getFieldsToCheck(user);
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });
  });
});
