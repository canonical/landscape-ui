import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import { User } from "@/types/User";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import UserList from "./UserList";
import NoData from "@/components/layout/NoData";
import { expectLoadingState } from "@/tests/helpers";

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

      const statuses = screen.getAllByRole("cell", {
        name: /status/i,
      });

      const lockedIconElement = statuses.find((status) => {
        return status
          .querySelector("i")
          ?.classList.contains("p-icon--lock-locked-active");
      });
      expect(lockedIconElement).toBeInTheDocument();

      const unlockedIconElement = statuses.find((status) => {
        return status
          .querySelector("i")
          ?.classList.contains("p-icon--lock-unlock");
      });
      expect(unlockedIconElement).toBeInTheDocument();
    });

    it("should select all users when clicking ToggleAll checkbox", async () => {
      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await userEvent.click(toggleAllCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith(userIds);
    });

    it("should select user when clicking on its row checkbox", async () => {
      const selectedUser = users[0];

      const userCheckbox = await screen.findByRole("checkbox", {
        name: `Select user ${selectedUser.username}`,
      });
      expect(userCheckbox).toBeInTheDocument();
      await userEvent.click(userCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith([selectedUser.uid]);
    });
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
      const buttonNames = ["Unlock", "Edit", "Delete"];

      const userTableButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(userTableButton);

      const form = await screen.findByRole("complementary");

      await expectLoadingState();

      buttonNames.forEach((buttonName) => {
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
          { label: "name", value: user?.name ?? <NoData /> },
          { label: "passphrase", value: "****************" },
          { label: "primary group", value: primaryGroup ?? <NoData /> },
          { label: "additional groups", value: groupsData },
          { label: "location", value: user?.location ?? <NoData /> },
          { label: "home phone", value: user?.home_phone ?? <NoData /> },
          { label: "work phone", value: user?.work_phone ?? <NoData /> },
        ];
      };
      const fieldsToCheck = getFieldsToCheck(user);
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });
  });
});
