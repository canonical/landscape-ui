import { renderWithProviders } from "@/tests/render";
import AddRoleForm from "./AddRoleForm";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getPromisesToAddRole, getValuesToAddRole } from "./helpers";
import type { AccessGroupOption } from "@/pages/dashboard/settings/roles/types";
import type { FormProps } from "./types";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("AddRoleForm", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AddRoleForm />);

    expect(
      screen.getByRole("textbox", { name: /role name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("table")).toHaveLength(2);

    expect(screen.getByText("Access Groups")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add role/i }),
    ).toBeInTheDocument();
  });

  it("shows error messages when form is submitted with invalid data", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("shows error message when an invalid name is entered", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.type(screen.getByRole("textbox", { name: /role name/i }), "123");
    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(
      await screen.findByText(
        /name must start with a letter and can contain alphanumeric/i,
      ),
    ).toBeInTheDocument();
  });

  it("successfully submits the form with a valid role name", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.type(
      screen.getByRole("textbox", { name: /role name/i }),
      "NewRole",
    );

    await user.click(screen.getByRole("button", { name: /add role/i }));

    expect(
      await screen.findByText(/new role has been added/i),
    ).toBeInTheDocument();
  });

  it("triggers onPermissionChange for global permissions when a checkbox is clicked", async () => {
    renderWithProviders(<AddRoleForm />);

    const viewRolesCheckbox = await screen.findByRole("checkbox", {
      name: /view roles/i,
    });

    expect(viewRolesCheckbox).not.toBeChecked();
    await user.click(viewRolesCheckbox);
    expect(viewRolesCheckbox).toBeChecked();
  });

  it("triggers onPermissionChange for non-global permissions when a checkbox is clicked", async () => {
    renderWithProviders(<AddRoleForm />);

    const viewInstancesCheckbox = await screen.findByRole("checkbox", {
      name: /view instances/i,
    });

    expect(viewInstancesCheckbox).not.toBeChecked();
    await user.click(viewInstancesCheckbox);
    expect(viewInstancesCheckbox).toBeChecked();
  });

  it("triggers onAccessGroupChange when an access group checkbox is clicked", async () => {
    renderWithProviders(<AddRoleForm />);

    const globalAccessCheckbox = await screen.findByRole("checkbox", {
      name: /global access/i,
    });

    expect(globalAccessCheckbox).not.toBeChecked();
    await user.click(globalAccessCheckbox);
    expect(globalAccessCheckbox).toBeChecked();
  });

  it("silently handles errors that occur when adding permissions", async () => {
    renderWithProviders(<AddRoleForm />);

    await user.type(
      screen.getByRole("textbox", { name: /role name/i }),
      "TestRole",
    );

    const viewRolesCheckbox = await screen.findByRole("checkbox", {
      name: /view roles/i,
    });

    fireEvent.click(viewRolesCheckbox);

    setEndpointStatus({ status: "error", path: "editRole" });
    await user.click(screen.getByRole("button", { name: /add role/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add role/i }),
      ).not.toBeDisabled();
    });

    expect(
      screen.queryByText(/new role has been added/i),
    ).not.toBeInTheDocument();
  });
});

describe("getValuesToAddRole", () => {
  const baseValues: FormProps = {
    access_groups: [],
    description: "",
    name: "TestRole",
    permissions: [],
  };

  it("returns permissions unchanged when AddComputerToAccessGroup is not included", () => {
    const values = { ...baseValues, permissions: ["ViewComputer"] };
    const result = getValuesToAddRole(values, []);
    expect(result.permissionsToAdd).toEqual(["ViewComputer"]);
  });

  it("adds RemoveComputerFromAccessGroup when AddComputerToAccessGroup is included", () => {
    const values = {
      ...baseValues,
      permissions: ["AddComputerToAccessGroup"],
    };
    const result = getValuesToAddRole(values, []);
    expect(result.permissionsToAdd).toEqual([
      "AddComputerToAccessGroup",
      "RemoveComputerFromAccessGroup",
    ]);
  });

  it("returns empty accessGroupsToAdd when no access groups are selected", () => {
    const result = getValuesToAddRole(baseValues, []);
    expect(result.accessGroupsToAdd).toEqual([]);
  });

  it("returns accessGroupsToAdd when access groups are selected", () => {
    const options: AccessGroupOption[] = [
      {
        value: "global",
        label: "Global access",
        depth: 0,
        children: [],
        parents: [],
      },
    ];
    const values = { ...baseValues, access_groups: ["global"] };
    const result = getValuesToAddRole(values, options);
    expect(result.accessGroupsToAdd).toEqual(["global"]);
  });
});

describe("getPromisesToAddRole", () => {
  const baseValues: FormProps = {
    access_groups: [],
    description: "",
    name: "TestRole",
    permissions: [],
  };

  it("returns no promises when there are no permissions or access groups", () => {
    const addAccessGroups = vi.fn();
    const addPermissions = vi.fn();
    const handlers = {
      addAccessGroups,
      addPermissions,
    } as unknown as Parameters<typeof getPromisesToAddRole>[2];

    const promises = getPromisesToAddRole(baseValues, [], handlers);
    expect(promises).toHaveLength(0);
    expect(addPermissions).not.toHaveBeenCalled();
    expect(addAccessGroups).not.toHaveBeenCalled();
  });

  it("returns a promise for addPermissions when permissions are present", () => {
    const addPermissions = vi.fn();
    const handlers = {
      addAccessGroups: vi.fn(),
      addPermissions,
    } as unknown as Parameters<typeof getPromisesToAddRole>[2];
    const values = { ...baseValues, permissions: ["ViewComputer"] };

    const promises = getPromisesToAddRole(values, [], handlers);
    expect(promises).toHaveLength(1);
    expect(addPermissions).toHaveBeenCalledWith({
      name: "TestRole",
      permissions: ["ViewComputer"],
    });
  });

  it("returns a promise for addAccessGroups when access groups are present", () => {
    const addAccessGroups = vi.fn();
    const handlers = {
      addAccessGroups,
      addPermissions: vi.fn(),
    } as unknown as Parameters<typeof getPromisesToAddRole>[2];
    const options: AccessGroupOption[] = [
      {
        value: "global",
        label: "Global access",
        depth: 0,
        children: [],
        parents: [],
      },
    ];
    const values = { ...baseValues, access_groups: ["global"] };

    const promises = getPromisesToAddRole(values, options, handlers);
    expect(promises).toHaveLength(1);
    expect(addAccessGroups).toHaveBeenCalledWith({
      name: "TestRole",
      access_groups: ["global"],
    });
  });

  it("returns promises for both when permissions and access groups are present", () => {
    const addAccessGroups = vi.fn();
    const addPermissions = vi.fn();
    const handlers = {
      addAccessGroups,
      addPermissions,
    } as unknown as Parameters<typeof getPromisesToAddRole>[2];
    const options: AccessGroupOption[] = [
      {
        value: "global",
        label: "Global access",
        depth: 0,
        children: [],
        parents: [],
      },
    ];
    const values = {
      ...baseValues,
      access_groups: ["global"],
      permissions: ["ViewComputer"],
    };

    const promises = getPromisesToAddRole(values, options, handlers);
    expect(promises).toHaveLength(2);
  });
});
