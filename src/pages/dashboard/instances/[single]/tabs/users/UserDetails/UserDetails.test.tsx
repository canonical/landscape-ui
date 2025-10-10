import NoData from "@/components/layout/NoData";
import "@/tests/matcher";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe } from "vitest";
import UserDetails from "./UserDetails";

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

    const fieldsToCheck = [
      { label: "Username", value: user.username },
      { label: "Name", value: user?.name ?? <NoData /> },
      { label: "Password", value: "****************" },
      { label: "Primary group", value: primaryGroup ?? <NoData /> },
      { label: "Additional groups", value: groupsData },
      { label: "Location", value: user?.location ?? <NoData /> },
      { label: "Home phone", value: user?.home_phone ?? <NoData /> },
      { label: "Work phone", value: user?.work_phone ?? <NoData /> },
    ];

    fieldsToCheck.forEach((field) => {
      expect(container).toHaveInfoItem(field.label, field.value);
    });
  });
});
