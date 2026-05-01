import { renderWithProviders } from "@/tests/render";
import RoleList from "./RoleList";
import type { ComponentProps } from "react";
import { roles } from "@/tests/mocks/roles";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getPermissionListByType,
  getTableRows,
  handleCellProps,
  handleRowProps,
} from "./helpers";
import { permissions } from "@/tests/mocks/roles";
import { getPermissionOptions } from "@/pages/dashboard/settings/roles/helpers";
import type { Role } from "@/types/Role";
import type { Cell, Row } from "react-table";

const props: ComponentProps<typeof RoleList> = {
  roleList: roles,
};

describe("RoleList", () => {
  const user = userEvent.setup();

  it("renders RoleList correctly", () => {
    renderWithProviders(<RoleList {...props} />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    const columnHeaders = [
      /name/i,
      /administrators/i,
      /view/i,
      /manage/i,
      /actions/i,
    ];

    columnHeaders.forEach((header) => {
      expect(
        screen.getByRole("columnheader", { name: header }),
      ).toBeInTheDocument();
    });
  });

  it("renders the roles in the table", () => {
    renderWithProviders(<RoleList {...props} />);

    roles.forEach((role) => {
      expect(
        screen.getByRole("rowheader", { name: role.name }),
      ).toBeInTheDocument();
    });
  });

  it("does not render actions for GlobalAdmin role", () => {
    renderWithProviders(<RoleList {...props} />);

    expect(
      screen.queryByRole("button", { name: /globaladmin role actions/i }),
    ).not.toBeInTheDocument();
  });

  it("renders actions for non-GlobalAdmin roles", () => {
    renderWithProviders(<RoleList {...props} />);

    const nonGlobalAdminRole = roles.find((r) => r.name !== "GlobalAdmin");
    assert(nonGlobalAdminRole);

    const actionButtons = screen.getAllByRole("button", {
      name: new RegExp(`${nonGlobalAdminRole.name} role actions`, "i"),
    });
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it("can click outside the table without errors", async () => {
    renderWithProviders(<RoleList {...props} />);

    await user.click(document.body);
  });

  it("expands view permissions cell when Show more button is clicked", async () => {
    renderWithProviders(<RoleList {...props} />);

    const serverAdmin = roles.find((r) => r.name === "ServerAdmin");
    assert(serverAdmin);
    const row = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes(serverAdmin.name.toLowerCase()),
    });

    const viewCell = within(row).getByRole("cell", {
      name: /view permissions/i,
    });

    const showMoreBtn = await within(viewCell).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);

    expect(
      within(viewCell).queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("expands manage permissions cell when Show more button is clicked", async () => {
    renderWithProviders(<RoleList {...props} />);

    const serverAdmin = roles.find((r) => r.name === "ServerAdmin");
    assert(serverAdmin);
    const row = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes(serverAdmin.name.toLowerCase()),
    });

    const manageCell = within(row).getByRole("cell", {
      name: /manage permissions/i,
    });

    const showMoreBtn = await within(manageCell).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);

    expect(
      within(manageCell).queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("collapses expanded view cell when clicking outside", async () => {
    const { container } = renderWithProviders(<RoleList {...props} />);

    const serverAdmin = roles.find((r) => r.name === "ServerAdmin");
    assert(serverAdmin);
    const row = screen.getByRole("row", {
      name: (n) => n.toLowerCase().includes(serverAdmin.name.toLowerCase()),
    });

    const viewCell = within(row).getByRole("cell", {
      name: /view permissions/i,
    });

    const showMoreBtn = await within(viewCell).findByRole("button", {
      name: /show more/i,
    });

    await user.click(showMoreBtn);
    await user.click(container);

    expect(
      within(viewCell).queryByRole("button", { name: /show more/i }),
    ).toBeInTheDocument();
  });
});

describe("handleCellProps", () => {
  const makeCell = (columnId: string, rowIndex: number) =>
    ({
      column: { id: columnId },
      row: { index: rowIndex },
    }) as unknown as Cell<Role>;

  it("sets expandedCell className when coordinates match", () => {
    const expandedCell = { rowIndex: 1, columnId: "view" };
    const result = handleCellProps(expandedCell)(makeCell("view", 1));
    expect(result.className).toBe("expandedCell");
  });

  it("does not set className when row index does not match", () => {
    const expandedCell = { rowIndex: 0, columnId: "view" };
    const result = handleCellProps(expandedCell)(makeCell("view", 1));
    expect(result.className).toBeUndefined();
  });

  it("does not set className when expandedCell is null", () => {
    const result = handleCellProps(null)(makeCell("view", 0));
    expect(result.className).toBeUndefined();
  });

  it("sets role='rowheader' for the name column", () => {
    const result = handleCellProps(null)(makeCell("name", 0));
    expect(result.role).toBe("rowheader");
  });

  it("sets aria-label='Administrators' for the persons column", () => {
    const result = handleCellProps(null)(makeCell("persons", 0));
    expect(result["aria-label"]).toBe("Administrators");
  });

  it("sets aria-label='View permissions' for the view column", () => {
    const result = handleCellProps(null)(makeCell("view", 0));
    expect(result["aria-label"]).toBe("View permissions");
  });

  it("sets aria-label='Manage permissions' for the manage column", () => {
    const result = handleCellProps(null)(makeCell("manage", 0));
    expect(result["aria-label"]).toBe("Manage permissions");
  });

  it("sets aria-label='Actions' for the actions column", () => {
    const result = handleCellProps(null)(makeCell("actions", 0));
    expect(result["aria-label"]).toBe("Actions");
  });

  it("does not set className when expandedCell columnId does not match", () => {
    const expandedCell = { rowIndex: 0, columnId: "view" };
    const result = handleCellProps(expandedCell)(makeCell("manage", 0));
    expect(result.className).toBeUndefined();
  });
});

describe("handleRowProps", () => {
  const makeRow = (index: number) => ({ index }) as unknown as Row<Role>;

  it("sets expandedRow className when rowIndex matches", () => {
    const result = handleRowProps(2)(makeRow(2));
    expect(result.className).toBe("expandedRow");
  });

  it("does not set className when rowIndex does not match", () => {
    const result = handleRowProps(0)(makeRow(1));
    expect(result.className).toBeUndefined();
  });

  it("does not set className when rowIndex is undefined", () => {
    const result = handleRowProps(undefined)(makeRow(0));
    expect(result.className).toBeUndefined();
  });
});

describe("getPermissionListByType", () => {
  const permissionOptions = getPermissionOptions([...permissions]);

  it("returns empty string when role has no relevant permissions", () => {
    const role: Role = {
      name: "EmptyRole",
      description: "",
      permissions: [],
      global_permissions: [],
      persons: [],
      access_groups: [],
    };
    expect(getPermissionListByType(role, permissionOptions, "view")).toBe("");
    expect(getPermissionListByType(role, permissionOptions, "manage")).toBe("");
  });

  it("returns 'All properties' when all permissions of a type are present", () => {
    const serverAdmin = roles.find((r) => r.name === "ServerAdmin");
    assert(serverAdmin);
    const result = getPermissionListByType(
      serverAdmin,
      permissionOptions,
      "view",
    );
    expect(result).toBe("All properties");
  });

  it("returns a comma-separated list when only some permissions are present", () => {
    const desktopAdmin = roles.find((r) => r.name === "DesktopAdmin");
    assert(desktopAdmin);
    const result = getPermissionListByType(
      desktopAdmin,
      permissionOptions,
      "view",
    );
    expect(typeof result).toBe("string");
    expect(result).not.toBe("All properties");
    expect(result).not.toBe("");
  });

  it("handles a role without global_permissions property", () => {
    const globalAdmin = roles.find((r) => r.name === "GlobalAdmin");
    assert(globalAdmin);
    const result = getPermissionListByType(
      globalAdmin,
      permissionOptions,
      "view",
    );
    expect(typeof result).toBe("string");
  });
});

describe("getTableRows (RoleList)", () => {
  it("does not modify ref.current when instance is null", () => {
    const ref = { current: [] as HTMLTableRowElement[] };
    getTableRows(ref)(null);
    expect(ref.current).toHaveLength(0);
  });

  it("sets ref.current to tbody tr elements when instance is provided", () => {
    const ref = { current: [] as HTMLTableRowElement[] };
    const div = document.createElement("div");
    div.innerHTML = "<table><tbody><tr></tr><tr></tr></tbody></table>";
    getTableRows(ref)(div);
    expect(ref.current).toHaveLength(2);
  });
});
