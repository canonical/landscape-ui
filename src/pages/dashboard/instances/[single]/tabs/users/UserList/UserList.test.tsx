import NoData from "@/components/layout/NoData";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import type { User } from "@/types/User";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import UserList from "./UserList";

const userIds = users.map((user) => user.uid);
const unlockedUser = users.find((user) => user.enabled);
const lockedUser = users.find((user) => !user.enabled);

const props = {
  instanceId: 21,
  users: users,
  selected: [],
  setSelected: vi.fn(),
};

describe("UserList", () => {
  it("renders a list of users", async () => {
    renderWithProviders(<UserList {...props} />);

    for (const user of users) {
      const listUser = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });

      expect(listUser).toBeInTheDocument();
    }
  });

  describe("Table Interactions", () => {
    it("shows locked and unlocked user icon in the user table", async () => {
      renderWithProviders(<UserList {...props} />);

      const unlockedStatuses = screen.getAllByRole("cell", {
        name: "Unlocked",
      });

      const lockedStatuses = screen.getAllByRole("cell", {
        name: "Locked",
      });

      expect(lockedStatuses[0]).toHaveIcon("lock-locked-active");
      expect(unlockedStatuses[0]).toHaveIcon("lock-unlock");
    });

    it("should select all users when clicking ToggleAll checkbox", async () => {
      const { rerender } = renderWithProviders(<UserList {...props} />);
      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await userEvent.click(toggleAllCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith(userIds);

      rerender(<UserList {...props} selected={userIds} />);
      const checkedCheckboxes = screen.getAllByRole("checkbox", {
        checked: true,
      });

      expect(checkedCheckboxes).toHaveLength(userIds.length + 1);
    });

    it("should select user when clicking on its row checkbox", async () => {
      renderWithProviders(<UserList {...props} />);

      const [selectedUser] = users;

      const userCheckbox = await screen.findByRole("checkbox", {
        name: `Select user ${selectedUser.username}`,
      });
      expect(userCheckbox).toBeInTheDocument();
      await userEvent.click(userCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith([selectedUser.uid]);
    });
  });

  describe("User details sidepanel", () => {
    beforeEach(() => {
      renderWithProviders(<UserList {...props} />);
      setScreenSize("lg");
    });
    it("should open side panel when user in table is clicked", async () => {
      const user = await screen.findByRole("button", {
        name: `Show details of user ${users[0].username}`,
      });
      await userEvent.click(user);

      const form = await screen.findByTestId("globalSidePanel");
      const heading = within(form).getByText("User details");
      expect(heading).toBeVisible();
    });

    it("should show correct locked user side panel action buttons", async () => {
      assert(lockedUser);
      const user = lockedUser;
      const buttonNames = ["Unlock", "Edit", "Delete"];

      const userTableButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(userTableButton);

      const form = await screen.findByTestId("globalSidePanel");

      await expectLoadingState();

      buttonNames.forEach((buttonName) => {
        const button = within(form).getByText(buttonName);
        expect(button).toBeInTheDocument();
      });
    });

    it("should show correct unlocked user side panel action buttons", async () => {
      assert(unlockedUser);
      const userTableButton = await screen.findByRole("button", {
        name: `Show details of user ${unlockedUser.username}`,
      });

      await userEvent.click(userTableButton);
      const form = await screen.findByTestId("globalSidePanel");
      const buttonsNames = ["Lock", "Edit", "Delete"];

      buttonsNames.forEach((buttonName) => {
        const button = within(form).getByText(buttonName);
        expect(button).toBeInTheDocument();
      });
    });

    it("should show correct side panel details for a user", async () => {
      assert(unlockedUser);
      const user = unlockedUser;

      const tableUserButton = await screen.findByRole("button", {
        name: `Show details of user ${user.username}`,
      });
      await userEvent.click(tableUserButton);

      const form = await screen.findByTestId("globalSidePanel");
      const primaryGroup =
        userGroups.find((group) => group.gid === user.primary_gid)?.name ?? "";

      const groupsData = userGroups.map((group) => group.name).join(", ");
      const loaded = await screen.findByText(primaryGroup);
      expect(loaded).toBeInTheDocument();
      const getFieldsToCheck = (item: User) => {
        return [
          { label: "username", value: item.username },
          { label: "name", value: item?.name ?? <NoData /> },
          { label: "passphrase", value: "****************" },
          { label: "primary group", value: primaryGroup ?? <NoData /> },
          { label: "additional groups", value: groupsData },
          { label: "location", value: item?.location ?? <NoData /> },
          { label: "home phone", value: item?.home_phone ?? <NoData /> },
          { label: "work phone", value: item?.work_phone ?? <NoData /> },
        ];
      };
      const fieldsToCheck = getFieldsToCheck(user);
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });
  });
});
