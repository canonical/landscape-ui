import type { Activity } from "@/features/activities";
import { PATHS, ROUTES } from "@/libs/routes";
import ActivitiesPage from "@/pages/dashboard/activities/ActivitiesPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router";
import PendingUserActivity from "./PendingUserActivity";

const [user] = users;
assert(user);

const renderPendingUserActivity = (operation: "lock" | "unlock" | "delete") =>
  renderWithProviders(
    <Routes>
      <Route
        path="*"
        element={
          <PendingUserActivity
            user={{
              ...user,
              pending_activity: {
                activity_id: 103,
                activity_status: "undelivered",
                summary: `${operation} user ${user.username}`,
                operation,
              },
            }}
          />
        }
      />
      <Route path={PATHS.activities.root} element={<ActivitiesPage />} />
    </Routes>,
  );

describe("PendingUserActivity", () => {
  it("opens the listed child activity with its instance and available actions", async () => {
    const childActivity: Activity = {
      ...activities[0],
      id: 103,
      parent_id: 102,
      type: "LockUserRequest",
      summary: `lock user ${user.username}`,
      computer_id: ubuntuInstance.id,
      activity_status: "undelivered",
      completion_time: null,
      delivery_time: null,
      result_text: null,
      actions: { approvable: false, cancelable: true, reappliable: false },
    };
    setEndpointStatus([
      { status: "variant", path: "activities", response: [childActivity] },
      { status: "variant", path: "activities/:id", response: childActivity },
    ]);
    const userEventInstance = userEvent.setup();
    renderPendingUserActivity("lock");

    const activityLink = await screen.findByRole("link", {
      name: `View Pending activity to lock for ${user.username}`,
    });
    expect(activityLink).toHaveTextContent("Pending activity to lock");

    await userEventInstance.click(activityLink);

    const panel = screen
      .getByRole("heading", { level: 3, name: childActivity.summary })
      .closest("aside");
    assert(panel);
    expect(
      await within(panel).findByRole("link", { name: ubuntuInstance.title }),
    ).toHaveAttribute(
      "href",
      ROUTES.instances.details.fromInstance(ubuntuInstance),
    );
    expect(panel).toHaveInfoItem("Description", childActivity.summary);
    expect(
      within(panel).getByRole("button", { name: "Cancel activity" }),
    ).toBeEnabled();
    expect(
      within(panel).queryByRole("button", { name: "Approve" }),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole("button", { name: "Redo" }),
    ).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toHaveValue(
      `id:${childActivity.id}`,
    );
    const table = await screen.findByRole("table");
    expect(
      within(table).getByRole("button", { name: childActivity.summary }),
    ).toBeInTheDocument();
  });

  it("renders a pending deletion activity", async () => {
    renderPendingUserActivity("delete");

    expect(
      await screen.findByRole("link", {
        name: `View Pending activity to delete for ${user.username}`,
      }),
    ).toHaveTextContent("Pending activity to delete");
  });
});
