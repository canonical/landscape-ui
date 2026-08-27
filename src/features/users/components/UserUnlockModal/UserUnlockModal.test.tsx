import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { users } from "@/tests/mocks/user";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { ROUTES } from "@/libs/routes";
import UserUnlockModal from "./UserUnlockModal";

const routePath = "/instances/1/users";
const routePattern = "/instances/:instanceId/users";

describe("UserUnlockModal", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders single user title and copy", () => {
    const lockedUser = users.find((u) => !u.enabled) ?? users[1];
    renderWithProviders(
      <UserUnlockModal close={vi.fn()} selectedUsers={[lockedUser]} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByRole("heading", {
        name: `Unlock user ${lockedUser.username}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/restore login access for the user/i),
    ).toBeInTheDocument();
  });

  it("renders multiple users title", () => {
    renderWithProviders(
      <UserUnlockModal close={vi.fn()} selectedUsers={users.slice(0, 3)} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByRole("heading", { name: "Unlock 3 users" }),
    ).toBeInTheDocument();
  });

  it("renders mixed-state copy for multiple users", () => {
    renderWithProviders(
      <UserUnlockModal close={vi.fn()} selectedUsers={users.slice(0, 4)} />,
      undefined,
      routePath,
      routePattern,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent("You selected 4 users.");
    expect(dialog).toHaveTextContent("unlock 1 user");
    expect(dialog).toHaveTextContent("leave 3 users unlocked");
  });

  it("renders same-state copy when all selected users are locked", () => {
    renderWithProviders(
      <UserUnlockModal
        close={vi.fn()}
        selectedUsers={users.filter((selectedUser) => !selectedUser.enabled)}
      />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByText(/restore login access for the users of these accounts/i),
    ).toBeInTheDocument();
  });

  it("links to a pending activity for one user", () => {
    const userWithPendingActivity = {
      ...users[0],
      pending_activity: {
        activity_id: 201,
        activity_status: "undelivered" as const,
        summary: "Lock out user user1",
        operation: "lock" as const,
      },
    };

    renderWithProviders(
      <UserUnlockModal
        close={vi.fn()}
        selectedUsers={[userWithPendingActivity]}
      />,
      undefined,
      routePath,
      routePattern,
    );

    expect(screen.getByRole("link", { name: "View activity" })).toHaveAttribute(
      "href",
      ROUTES.activities.root({ query: "id:201" }),
    );
    expect(screen.getByRole("dialog")).toHaveTextContent(
      "This user has a pending activity to be locked. View activity. If you proceed, a new activity will be queued for this user.",
    );
  });

  it("links to pending activities for multiple users", () => {
    const selectedUsers = [
      {
        ...users[0],
        pending_activity: {
          activity_id: 201,
          activity_status: "undelivered" as const,
          summary: "Lock out user user1",
          operation: "lock" as const,
        },
      },
      {
        ...users[1],
        pending_activity: {
          activity_id: 202,
          activity_status: "delivered" as const,
          summary: "Unlock user user2",
          operation: "unlock" as const,
        },
      },
      users[2],
    ];

    renderWithProviders(
      <UserUnlockModal close={vi.fn()} selectedUsers={selectedUsers} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByRole("link", { name: "pending activities" }),
    ).toHaveAttribute(
      "href",
      ROUTES.activities.root({ query: "id:201 OR id:202" }),
    );
    expect(screen.getByRole("dialog")).toHaveTextContent(
      "2 users have pending activities. If you proceed, a new activity will be queued for each selected user.",
    );
  });

  it("calls close when clicking Cancel button", async () => {
    const close = vi.fn();
    renderWithProviders(
      <UserUnlockModal close={close} selectedUsers={[users[0]]} />,
      undefined,
      routePath,
      routePattern,
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Cancel",
      }),
    );
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("submits unlock action, shows success notification, and closes the modal", async () => {
    const close = vi.fn();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <UserUnlockModal
        close={close}
        selectedUsers={[users[0]]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      routePath,
      routePattern,
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Unlock",
      }),
    );

    expect(
      await screen.findByText("An activity is queued to unlock user1."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You queued user1 to be unlocked."),
    ).toBeInTheDocument();
    expect(handleClearSelection).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
  });

  it("handles error during unlock submission", async () => {
    setEndpointStatus({ status: "error", path: "unlockUser" });

    renderWithProviders(
      <UserUnlockModal close={vi.fn()} selectedUsers={[users[0]]} />,
      undefined,
      routePath,
      routePattern,
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Unlock",
      }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
