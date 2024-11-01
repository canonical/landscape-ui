import "@/tests/matcher";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { User } from "@/types/User";
import { describe } from "vitest";
import UserDetails from "./UserDetails";
import { userGroups } from "@/tests/mocks/userGroup";
import { screen } from "@testing-library/react";
import NoData from "@/components/layout/NoData";

const unlockedUser = users.find((user) => user.enabled);

describe("user details", () => {
  it("should show correct side panel details for a user", async () => {
    assert(unlockedUser);

    const user = unlockedUser;
    const { container } = renderWithProviders(<UserDetails user={user} />);

    const primaryGroup =
      userGroups.find((group) => group.gid === user.primary_gid)?.name ?? "";

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
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });
});
