import { accessGroups } from "@/tests/mocks/accessGroup";
import { permissions, roles } from "@/tests/mocks/roles";
import type { Role } from "@/types/Role";
import type { AccessGroupOption, PermissionOption } from "../types";
import { getAccessGroupOptions, getPermissionOptions } from "../helpers";
import {
  addImpliedViewPermissions,
  getPromisesToEditRole,
  getRoleFormProps,
  getValuesToEditRole,
} from "./helpers";

const manageComputerPermission = permissions.find(
  (p) => p.name === "ManageComputer",
);
const viewComputerPermission = permissions.find(
  (p) => p.name === "ViewComputer",
);
assert(manageComputerPermission, "Mock 'ManageComputer' permission not found");
assert(viewComputerPermission, "Mock 'ViewComputer' permission not found");

const helperAccessGroupOptions: AccessGroupOption[] = [
  {
    value: "global",
    label: "global",
    children: [],
    depth: 0,
    parents: [],
  },
  {
    value: "Server machines",
    label: "Server machines",
    children: [],
    depth: 0,
    parents: [],
  },
];

const helperPermissionOptions: PermissionOption[] = [
  {
    values: { manage: "ManageComputers", view: "ViewComputers" },
    label: "Computers",
    global: false,
  },
  {
    values: { manage: "ManageScripts", view: "ViewScripts" },
    label: "Scripts",
    global: false,
  },
];

describe("Role Helpers", () => {
  describe("addImpliedViewPermissions", () => {
    const permissionOptions = getPermissionOptions(permissions);

    it("should add the implied 'view' permission when a 'manage' permission is present", () => {
      const result = addImpliedViewPermissions(
        [manageComputerPermission.name],
        permissionOptions,
      );
      expect(result.sort()).toEqual(
        [manageComputerPermission.name, viewComputerPermission.name].sort(),
      );
    });

    it("should not add duplicates if both 'manage' and 'view' are already present", () => {
      const result = addImpliedViewPermissions(
        [manageComputerPermission.name, viewComputerPermission.name],
        permissionOptions,
      );
      expect(result.sort()).toEqual(
        [manageComputerPermission.name, viewComputerPermission.name].sort(),
      );
    });

    it("should not add a 'manage' permission if only 'view' is present", () => {
      const result = addImpliedViewPermissions(
        [viewComputerPermission.name],
        permissionOptions,
      );
      expect(result).toEqual([viewComputerPermission.name]);
    });

    it("should ignore permission options with an empty string 'manage' key", () => {
      const options: PermissionOption[] = [
        ...permissionOptions,
        {
          label: "WithEmptyManageString",
          global: false,
          values: { manage: "", view: "ViewEventLog" },
        },
      ];
      const initialPermissions = ["ViewRole", ""];
      const result = addImpliedViewPermissions(initialPermissions, options);
      expect(result.sort()).toEqual(initialPermissions.sort());
    });
  });

  describe("getValuesToEditRole", () => {
    const rolePermissionOptions = getPermissionOptions(permissions);
    const roleAccessGroupOptions = getAccessGroupOptions(accessGroups);
    const mockRole: Role = {
      name: "TestRole",
      permissions: [],
      global_permissions: [],
      access_groups: [],
      description: "Test role description",
      persons: [],
    };

    it("should find no changes if 'view' was implied from 'manage' (BUG FIX)", () => {
      const role: Role = {
        ...mockRole,
        permissions: [manageComputerPermission.name],
      };
      const formValues = {
        permissions: [
          manageComputerPermission.name,
          viewComputerPermission.name,
        ],
        accessGroups: [],
      };

      const { permissionsToAdd, permissionsToRemove } = getValuesToEditRole(
        formValues,
        role,
        roleAccessGroupOptions,
        rolePermissionOptions,
      );

      expect(permissionsToAdd).toEqual([]);
      expect(permissionsToRemove).toEqual([]);
    });

    it("should find no changes for a pre-existing global permission (BUG FIX)", () => {
      const role: Role = {
        ...mockRole,
        global_permissions: ["ViewRole"],
      };
      const formValues = {
        permissions: ["ViewRole"],
        accessGroups: [],
      };

      const { permissionsToAdd, permissionsToRemove } = getValuesToEditRole(
        formValues,
        role,
        roleAccessGroupOptions,
        rolePermissionOptions,
      );

      expect(permissionsToAdd).toEqual([]);
      expect(permissionsToRemove).toEqual([]);
    });

    it("should find no changes in a combined scenario of global and implied permissions", () => {
      const role: Role = {
        ...mockRole,
        permissions: [manageComputerPermission.name],
        global_permissions: ["ViewRole"],
      };
      const formValues = {
        permissions: [
          manageComputerPermission.name,
          viewComputerPermission.name,
          "ViewRole",
        ],
        accessGroups: [],
      };

      const { permissionsToAdd, permissionsToRemove } = getValuesToEditRole(
        formValues,
        role,
        roleAccessGroupOptions,
        rolePermissionOptions,
      );

      expect(permissionsToAdd).toEqual([]);
      expect(permissionsToRemove).toEqual([]);
    });

    it("computes permission and access-group deltas", () => {
      const role = {
        ...mockRole,
        permissions: ["ManageComputers"],
        global_permissions: ["ViewComputers"],
        access_groups: ["global"],
      };
      const values = {
        permissions: ["ManageScripts"],
        accessGroups: ["global", "Server machines"],
      };

      expect(
        getValuesToEditRole(
          values,
          role,
          helperAccessGroupOptions,
          helperPermissionOptions,
        ),
      ).toEqual({
        accessGroupsToAdd: ["Server machines"],
        accessGroupsToRemove: [],
        permissionsToAdd: ["ManageScripts", "ViewScripts"],
        permissionsToRemove: ["ManageComputers", "ViewComputers"],
      });
    });
  });

  describe("getPromisesToEditRole", () => {
    it("builds mutation promises only for changed values", () => {
      const addAccessGroups = vi.fn().mockResolvedValue({} as never);
      const addPermissions = vi.fn().mockResolvedValue({} as never);
      const removeAccessGroups = vi.fn().mockResolvedValue({} as never);
      const removePermissions = vi.fn().mockResolvedValue({} as never);

      const promises = getPromisesToEditRole(
        {
          permissions: ["ManageScripts"],
          accessGroups: ["global", "Server machines"],
        },
        {
          ...roles[0],
          permissions: ["ManageComputers"],
          global_permissions: ["ViewComputers"],
          access_groups: ["global"],
        },
        helperAccessGroupOptions,
        helperPermissionOptions,
        {
          addAccessGroups,
          addPermissions,
          removeAccessGroups,
          removePermissions,
        },
      );

      expect(promises.addAccessGroupsPromise).toBeDefined();
      expect(promises.addPermissionsPromise).toBeDefined();
      expect(promises.removePermissionsPromise).toBeDefined();
      expect(promises.removeAccessGroupsPromise).toBeUndefined();
    });
  });

  describe("getRoleFormProps", () => {
    it("builds form props with implied permissions and nested access groups", () => {
      const formProps = getRoleFormProps(
        {
          ...roles[0],
          access_groups: ["global"],
          permissions: ["ManageComputers"],
          global_permissions: [],
        },
        [
          {
            value: "global",
            label: "global",
            children: ["child-group"],
            depth: 0,
            parents: [],
          },
        ],
        [
          {
            values: { manage: "ManageComputers", view: "ViewComputers" },
            label: "Computers",
            global: false,
          },
        ],
      );

      expect(formProps).toEqual({
        accessGroups: ["global", "child-group"],
        permissions: ["ManageComputers", "ViewComputers"],
      });
    });
  });
});
