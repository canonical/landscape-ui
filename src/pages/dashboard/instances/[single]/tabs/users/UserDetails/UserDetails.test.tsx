import "@/tests/matcher";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { User } from "@/types/User";
import { describe } from "vitest";
import UserDetails from "./UserDetails";
import { userGroups } from "@/tests/mocks/userGroup";
import { screen } from "@testing-library/react";

const unlockedUser = users.find((user) => user.enabled)!;

describe("user details", () => {
  it("should show correct side panel details for a user", async () => {
    const user = unlockedUser;
    const { container } = renderWithProviders(<UserDetails user={user} />);

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
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });
});
