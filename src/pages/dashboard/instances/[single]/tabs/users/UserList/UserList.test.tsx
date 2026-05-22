import NoData, { NO_DATA_TEXT } from "@/components/layout/NoData";
import { setScreenSize, expectLoadingState } from "@/tests/helpers";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import type { User } from "@/types/User";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi, beforeEach, it, assert } from "vitest";
import UserList from "./UserList";
import UserPanel from "../UserPanel";
import { MASKED_VALUE } from "@/constants";
import LocationDisplay from "@/tests/LocationDisplay";

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

    it("should clear all selected users when clicking ToggleAll with selected users", async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserList {...props} selected={userIds} />);

      const toggleAllCheckbox = await screen.findByRole("checkbox", {
        name: /toggle all/i,
      });
      await user.click(toggleAllCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith([]);
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

    it("should unselect user when clicking an already selected row checkbox", async () => {
      const user = userEvent.setup();
      const [selectedUser] = users;
      assert(selectedUser);

      renderWithProviders(
        <UserList {...props} selected={[selectedUser.uid]} />,
      );

      const userCheckbox = await screen.findByRole("checkbox", {
        name: `Select user ${selectedUser.username}`,
      });
      await user.click(userCheckbox);

      expect(props.setSelected).toHaveBeenCalledWith([]);
    });
  });

  describe("User details sidepanel", () => {
    beforeEach(() => {
      setScreenSize("lg");
    });
    it("should update url when user in table is clicked", async () => {
      renderWithProviders(
        <>
          <UserList {...props} />
          <LocationDisplay />
        </>
      );
      const user = await screen.findByRole("button", {
        name: `Show details of user ${users[0].username}`,
      });
      await userEvent.click(user);

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=view");
      expect(screen.getByTestId("location")).toHaveTextContent(`name=${users[0].uid}`);
    });

    it("should show correct locked user side panel action buttons", async () => {
      assert(lockedUser);
      const user = lockedUser;
      const buttonNames = ["Unlock", "Edit", "Delete"];

      renderWithProviders(<UserPanel />, undefined, `/?sidePath=view&name=${user.uid}`);
      await expectLoadingState();

      const form = await screen.findByRole("complementary", { name: "Side panel" });
      await within(form).findByRole("button", { name: "Unlock" });
      buttonNames.forEach((buttonName) => {
        expect(
          within(form).getByRole("button", { name: buttonName }),
        ).toBeInTheDocument();
      });
    });

    it("should show correct unlocked user side panel action buttons", async () => {
      assert(unlockedUser);
      renderWithProviders(<UserPanel />, undefined, `/?sidePath=view&name=${unlockedUser.uid}`);
      await expectLoadingState();

      const form = await screen.findByRole("complementary", { name: "Side panel" });
      const buttonsNames = ["Lock", "Edit", "Delete"];

      await within(form).findByRole("button", { name: "Lock" });
      buttonsNames.forEach((buttonName) => {
        expect(
          within(form).getByRole("button", { name: buttonName }),
        ).toBeInTheDocument();
      });
    });

    it("should show correct side panel details for a user", async () => {
      assert(unlockedUser);
      const user = unlockedUser;

      renderWithProviders(<UserPanel />, undefined, `/?sidePath=view&name=${user.uid}`);
      await expectLoadingState();

      const form = await screen.findByRole("complementary", { name: "Side panel" });
      const primaryGroup =
        userGroups.find((group) => group.gid === user.primary_gid)?.name ?? "";

      const groupsData = userGroups.map((group) => group.name).join(", ");
      const loaded = await within(form).findByText(
        primaryGroup,
        {},
        { timeout: 5000 },
      );
      expect(loaded).toBeInTheDocument();
      const getFieldsToCheck = (item: User) => {
        return [
          { label: "Username", value: item.username },
          { label: "Name", value: item?.name ?? <NoData /> },
          { label: "Password", value: MASKED_VALUE },
          { label: "Primary group", value: primaryGroup ?? <NoData /> },
          { label: "Additional groups", value: groupsData },
          { label: "Location", value: item?.location ?? <NoData /> },
          { label: "Home phone", value: item?.home_phone ?? <NoData /> },
          { label: "Work phone", value: item?.work_phone ?? <NoData /> },
        ];
      };
      const fieldsToCheck = getFieldsToCheck(user);
      fieldsToCheck.forEach((field) => {
        expect(form).toHaveInfoItem(field.label, field.value);
      });
    });

    it("should open edit user side panel from list actions", async () => {
      const user = userEvent.setup();
      const [firstUser] = users;
      assert(firstUser);

      renderWithProviders(
        <>
          <UserList {...props} />
          <LocationDisplay />
        </>
      );

      const actionsToggle = await screen.findByRole("button", {
        name: `"${firstUser.name}" user actions`,
      });
      await user.click(actionsToggle);

      await user.click(await screen.findByText("Edit"));

      expect(screen.getByTestId("location")).toHaveTextContent("sidePath=edit");
      expect(screen.getByTestId("location")).toHaveTextContent(`name=${firstUser.uid}`);
    });
  });

  it("shows no-data marker when a user has no full name", async () => {
    const userWithoutName = {
      ...users[0],
      uid: 999,
      username: "no-name-user",
      name: "",
    };

    renderWithProviders(
      <UserList {...props} users={[userWithoutName]} selected={[]} />,
    );

    const detailsButton = await screen.findByRole("button", {
      name: `Show details of user ${userWithoutName.username}`,
    });
    const row = detailsButton.closest("tr");
    assert(row);

    expect(within(row).getByText(NO_DATA_TEXT)).toBeInTheDocument();
  });
});

