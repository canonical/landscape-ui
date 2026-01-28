import { accessGroups } from "@/tests/mocks/accessGroup";
import { permissions } from "@/tests/mocks/roles";
import type { Role } from "@/types/Role";
import type { PermissionOption } from "../types";
import { getAccessGroupOptions, getPermissionOptions } from "../helpers";
import { addImpliedViewPermissions, getValuesToEditRole } from "./helpers";

const manageComputerPermission = permissions.find(
  (p) => p.name === "ManageComputer",
);
const viewComputerPermission = permissions.find(
  (p) => p.name === "ViewComputer",
);
assert(manageComputerPermission, "Mock 'ManageComputer' permission not found");
assert(viewComputerPermission, "Mock 'ViewComputer' permission not found");

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
    const permissionOptions = getPermissionOptions(permissions);
    const accessGroupOptions = getAccessGroupOptions(accessGroups);
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
        accessGroupOptions,
        permissionOptions,
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
        accessGroupOptions,
        permissionOptions,
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
        accessGroupOptions,
        permissionOptions,
      );

      expect(permissionsToAdd).toEqual([]);
      expect(permissionsToRemove).toEqual([]);
    });
  });
});
