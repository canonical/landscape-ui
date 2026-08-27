import NoData from "@/components/layout/NoData";
import { PATHS, ROUTES } from "@/libs/routes";
import "@/tests/matcher";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserDetails from "./UserDetails";
import { MASKED_VALUE } from "@/constants";

const unlockedUser = users.find((user) => user.enabled);

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;

const renderUserDetails = (user: NonNullable<typeof unlockedUser>) =>
  renderWithProviders(
    <UserDetails user={user} />,
    undefined,
    ROUTES.instances.details.single(1),
    routePattern,
  );

describe("user details", () => {
  it("shows a pending deletion activity notification", () => {
    assert(unlockedUser);
    const userWithPendingDeletion = {
      ...unlockedUser,
      pending_activity: {
        activity_id: 123,
        activity_status: "undelivered" as const,
        summary: "Delete user user1",
        operation: "delete" as const,
      },
    };

    renderUserDetails(userWithPendingDeletion);

    expect(screen.getByText("User activity pending:")).toBeInTheDocument();
    expect(
      screen.getByText("This user has a pending activity to be deleted."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View activity" })).toHaveAttribute(
      "href",
      ROUTES.activities.root({ query: "id:123" }),
    );
  });

  it("should show correct side panel details for a user", async () => {
    assert(unlockedUser);

    const user = unlockedUser;
    const { container } = renderUserDetails(user);

    const primaryGroup =
      userGroups.find((group) => group.gid === user.primary_gid)?.name ?? "";

    const groupsData = userGroups.map((group) => group.name).join(", ");
    const loaded = await screen.findByText(primaryGroup);
    expect(loaded).toBeInTheDocument();

    const fieldsToCheck = [
      { label: "Username", value: user.username },
      { label: "Name", value: user?.name ?? <NoData /> },
      { label: "Password", value: MASKED_VALUE },
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
