import { PATHS, ROUTES } from "@/libs/routes";
import { users } from "@/tests/mocks/user";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes, useLocation } from "react-router";
import PendingUserActivity from "./PendingUserActivity";

const [user] = users;
assert(user);

const ActivitiesDestination = () => {
  const { pathname, search, state } = useLocation();

  return (
    <>
      <output data-testid="activity-destination">
        {pathname}
        {search}
      </output>
      <output data-testid="selected-activity">{JSON.stringify(state)}</output>
    </>
  );
};

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
      <Route path={PATHS.activities.root} element={<ActivitiesDestination />} />
    </Routes>,
  );

describe("PendingUserActivity", () => {
  it("renders a pending lock activity and opens it", async () => {
    const userEventInstance = userEvent.setup();
    renderPendingUserActivity("lock");

    const activityLink = await screen.findByRole("link", {
      name: `View Pending activity to lock for ${user.username}`,
    });
    expect(activityLink).toHaveTextContent("Pending activity to lock");

    await userEventInstance.click(activityLink);

    expect(screen.getByTestId("activity-destination")).toHaveTextContent(
      ROUTES.activities.root({ query: "id:103" }),
    );
    expect(screen.getByTestId("selected-activity")).toHaveTextContent(
      JSON.stringify({
        activity: {
          id: 103,
          summary: `lock user ${user.username}`,
        },
      }),
    );
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