import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { users } from "@/tests/mocks/user";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { ROUTES } from "@/libs/routes";
import UserDeleteModal from "./UserDeleteModal";

const routePath = "/instances/1/users";
const routePattern = "/instances/:instanceId/users";

describe("UserDeleteModal", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders single user delete modal", () => {
    renderWithProviders(
      <UserDeleteModal close={vi.fn()} selectedUsers={[users[0]]} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByRole("heading", { name: `Delete ${users[0].username}` }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `This will delete user ${users[0].username}. You can delete this user's home folders at the same time.`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", {
        name: "Delete the home folders as well",
      }),
    ).toBeInTheDocument();
  });

  it("links to a pending deletion activity", () => {
    const userWithPendingDeletion = {
      ...users[0],
      pending_activity: {
        activity_id: 201,
        activity_status: "undelivered" as const,
        summary: "Delete user user1",
        operation: "delete" as const,
      },
    };

    renderWithProviders(
      <UserDeleteModal
        close={vi.fn()}
        selectedUsers={[userWithPendingDeletion]}
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
      "This user has a pending activity to be deleted. View activity. If you proceed, a new activity will be queued for this user.",
    );
  });

  it("renders multiple users delete modal", () => {
    renderWithProviders(
      <UserDeleteModal close={vi.fn()} selectedUsers={users.slice(0, 3)} />,
      undefined,
      routePath,
      routePattern,
    );

    expect(
      screen.getByRole("heading", { name: "Delete users" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will delete selected users. You can delete their home folders as well.",
      ),
    ).toBeInTheDocument();
  });

  it("calls close when clicking Cancel button", async () => {
    const close = vi.fn();
    renderWithProviders(
      <UserDeleteModal close={close} selectedUsers={[users[0]]} />,
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

  it("submits remove action with delete_home checkbox checked", async () => {
    const close = vi.fn();
    const handleClearSelection = vi.fn();

    renderWithProviders(
      <UserDeleteModal
        close={close}
        selectedUsers={[users[0]]}
        handleClearSelection={handleClearSelection}
      />,
      undefined,
      routePath,
      routePattern,
    );

    await user.click(
      screen.getByRole("checkbox", {
        name: "Delete the home folders as well",
      }),
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Delete",
      }),
    );

    expect(
      await screen.findByText("An activity is queued to delete user1."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You queued user1 to be deleted."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
    expect(handleClearSelection).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("handles error during delete submission", async () => {
    setEndpointStatus({ status: "error", path: "users" });

    renderWithProviders(
      <UserDeleteModal close={vi.fn()} selectedUsers={[users[0]]} />,
      undefined,
      routePath,
      routePattern,
    );

    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Delete",
      }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
