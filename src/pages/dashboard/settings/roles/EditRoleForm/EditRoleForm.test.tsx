import { roles } from "@/tests/mocks/roles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { PATHS, ROUTES } from "@/libs/routes";
import EditRoleForm from "./EditRoleForm";

const props: ComponentProps<typeof EditRoleForm> = {
  role: roles[0],
};
const routePattern = `/${PATHS.settings.root}/${PATHS.settings.roles}`;
const routePath = ROUTES.settings.roles();

describe("EditRoleForm", () => {
  it("renders EditRoleForm", async () => {
    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findAllByRole("checkbox");

    expect(screen.getByText("Global permissions")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Access Groups")).toBeInTheDocument();
    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
  });

  it("preselects role permissions and access groups", async () => {
    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    const checkedOptions = await screen.findAllByRole("checkbox", {
      checked: true,
    });

    expect(checkedOptions.length).toBeGreaterThan(0);
  });

  it("closes form when saving without changes", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findAllByRole("checkbox");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      screen.queryByText("Role changes have been saved"),
    ).not.toBeInTheDocument();
  });

  it("submits role updates and shows success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findAllByRole("checkbox");

    const removePermissionCheckbox = screen.getByRole("checkbox", {
      name: "Manage instances",
    });
    const addPermissionCheckbox = screen.getByRole("checkbox", {
      name: "Manage scripts",
    });
    const accessGroupCheckbox = screen.getByRole("checkbox", {
      name: "Server machines",
    });
    await user.click(removePermissionCheckbox);
    await user.click(addPermissionCheckbox);
    await user.click(accessGroupCheckbox);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText("Role changes have been saved"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You modified the role 'GlobalAdmin'"),
    ).toBeInTheDocument();
  });

  it("updates global permissions and existing permissions in one submit", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findAllByRole("checkbox");

    await user.click(
      screen.getByRole("checkbox", {
        name: "Manage account",
      }),
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: "Manage instances",
      }),
    );
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText("Role changes have been saved"),
    ).toBeInTheDocument();
  });

  it("shows endpoint error when role update fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "editRole" });

    renderWithProviders(
      <EditRoleForm {...props} />,
      undefined,
      routePath,
      routePattern,
    );

    await screen.findAllByRole("checkbox");

    const removePermissionCheckbox = screen.getByRole("checkbox", {
      name: "Manage instances",
    });
    const addPermissionCheckbox = screen.getByRole("checkbox", {
      name: "Manage scripts",
    });
    const accessGroupCheckbox = screen.getByRole("checkbox", {
      name: "Server machines",
    });
    await user.click(removePermissionCheckbox);
    await user.click(addPermissionCheckbox);
    await user.click(accessGroupCheckbox);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
