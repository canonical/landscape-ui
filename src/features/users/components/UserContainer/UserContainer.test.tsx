import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import UserContainer from "./UserContainer";

const renderUserContainer = () =>
  renderWithProviders(
    <UserContainer />,
    undefined,
    ROUTES.instances.details.single(1),
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

const openEditForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(
    await screen.findByRole("button", { name: '"user1" user actions' }),
  );
  await user.click(screen.getByRole("menuitem", { name: 'Edit "user1" user' }));
  await screen.findByRole("form");
};

describe("UserContainer", () => {
  it("shows a partial-save error above the table alongside a separate success toast", async () => {
    const user = userEvent.setup();
    setEndpointStatus([
      { status: "empty", path: "users/groups" },
      { status: "error", path: "userGroups" },
    ]);
    renderUserContainer();
    await openEditForm(user);
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(await screen.findByRole("checkbox", { name: "bin" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const message =
      "Group changes for user user1 could not be queued. Please try again.";
    const notification = await screen.findByText(message);
    const errorNotification = notification.closest(
      '[class*="p-notification--"]',
    );
    assert(errorNotification instanceof HTMLElement);
    expect(screen.getAllByText(message)).toHaveLength(1);
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(
      notification.compareDocumentPosition(screen.getByRole("table")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(notification.closest("aside")).toBeNull();
    expect(notification.closest('[class*="container"]')).toBeNull();
    expect(errorNotification).not.toHaveTextContent("were queued");

    const toast = screen.getByText(
      "User details for user user1 were queued for update.",
    );
    const toastNotification = toast.closest('[class*="p-notification--"]');
    assert(toastNotification instanceof HTMLElement);
    expect(toast.closest('[class*="container"]')).not.toBeNull();
    expect(toast.closest("aside")).toBeNull();
    expect(
      within(toastNotification).getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();

    await user.click(
      within(toastNotification).getByRole("button", {
        name: "Close notification",
      }),
    );
    expect(toast).not.toBeInTheDocument();
    expect(notification).toBeInTheDocument();

    await user.click(
      within(errorNotification).getByRole("button", {
        name: "Close notification",
      }),
    );
    expect(notification).not.toBeInTheDocument();
  });

  it("keeps a fully successful edit in a toast rather than above the table", async () => {
    const user = userEvent.setup();
    renderUserContainer();
    await openEditForm(user);
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const toast = await screen.findByText(
      "An activity is queued to edit user1.",
    );
    expect(
      screen.getAllByText("An activity is queued to edit user1."),
    ).toHaveLength(1);
    expect(toast.closest('[class*="container"]')).not.toBeNull();
    expect(toast.closest("aside")).toBeNull();
  });

  it("shows only a page error when group changes fail without any queued changes", async () => {
    const user = userEvent.setup();
    setEndpointStatus([
      { status: "empty", path: "users/groups" },
      { status: "error", path: "userGroups" },
    ]);
    renderUserContainer();
    await openEditForm(user);
    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(await screen.findByRole("checkbox", { name: "bin" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const notification = await screen.findByText(
      "Group changes for user user1 could not be queued. Please try again.",
    );
    expect(notification.closest('[class*="container"]')).toBeNull();
    expect(screen.queryByText(/were queued/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "View details" }),
    ).not.toBeInTheDocument();
  });

  it("shows the page error when editing from the user details panel", async () => {
    const user = userEvent.setup();
    setScreenSize("lg");
    setEndpointStatus([
      { status: "empty", path: "users/groups" },
      { status: "error", path: "userGroups" },
    ]);
    renderUserContainer();
    await user.click(
      await screen.findByRole("button", { name: "Show details of user user1" }),
    );
    await user.click(await screen.findByRole("button", { name: "Edit" }));
    await screen.findByRole("form");
    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(await screen.findByRole("checkbox", { name: "bin" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const notification = await screen.findByText(
      "Group changes for user user1 could not be queued. Please try again.",
    );
    expect(notification.closest("aside")).toBeNull();
    expect(notification.closest('[class*="container"]')).toBeNull();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("does not render a stray zero when no users are returned with an active search", async () => {
    setEndpointStatus({ status: "empty", path: "users" });
    renderWithProviders(
      <UserContainer />,
      undefined,
      `${ROUTES.instances.details.single(1)}?search=missing`,
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    expect(
      await screen.findByText(
        "No users found according to your search parameters.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("0", { exact: true })).not.toBeInTheDocument();
  });
});
