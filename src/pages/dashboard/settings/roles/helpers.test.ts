import {
  getPermissionOptions,
  getAccessGroupOptions,
  getSortedOptions,
  getAccessGroupsToSubmit,
} from "./helpers";
import { permissions } from "@/tests/mocks/roles";
import { accessGroups } from "@/tests/mocks/accessGroup";
import assert from "assert";

const [
  globalGroupMock,
  serverGroupMock,
  desktopGroupMock,
  testGroupMock,
  ,
  subTestGroupMock,
  subSubTestGroupMock,
] = accessGroups;

const [
  viewComputerPermission,
  manageComputerPermission,
  addComputerPermission,
] = permissions;

const manageAccountPermission = permissions.find(
  (p) => p.name === "ManageAccount",
);

assert(manageAccountPermission);

describe("Role and Permission Helpers", () => {
  describe("getPermissionOptions", () => {
    it("should correctly group view and manage permissions", () => {
      const options = getPermissionOptions(permissions);
      const instancesOption = options.find((opt) => opt.label === "instances");
      assert(instancesOption);

      expect(instancesOption.values.view).toBe(viewComputerPermission.name);
      expect(instancesOption.values.manage).toBe(manageComputerPermission.name);
    });

    it('should filter out "RemoveComputerFromAccessGroup"', () => {
      const options = getPermissionOptions(permissions);
      const removePermissionName = "RemoveComputerFromAccessGroup";
      const hasRemovePermission = options.some(
        (opt) =>
          opt.values.manage === removePermissionName ||
          opt.values.view === removePermissionName,
      );
      expect(hasRemovePermission).toBe(false);
    });

    it('should correctly label "AddComputerToAccessGroup" as "access group"', () => {
      const options = getPermissionOptions(permissions);
      const accessGroupOption = options.find(
        (opt) => opt.label === "access group",
      );
      assert(accessGroupOption);
      expect(accessGroupOption.values.manage).toBe(addComputerPermission.name);
    });

    it("should handle an empty array of permissions", () => {
      const options = getPermissionOptions([]);
      expect(options).toEqual([]);
    });

    it("should set the global flag correctly based on the permission", () => {
      const options = getPermissionOptions(permissions);
      const instancesOption = options.find((opt) => opt.label === "instances");
      const accountOption = options.find((opt) => opt.label === "account");

      assert(instancesOption);
      assert(accountOption);

      expect(instancesOption.global).toBe(viewComputerPermission.global);
      expect(accountOption.global).toBe(manageAccountPermission.global);
    });
  });

  describe("getAccessGroupOptions", () => {
    it("should build a hierarchical structure from a flat list", () => {
      const options = getAccessGroupOptions(accessGroups);

      const globalGroup = options.find(
        (opt) => opt.value === globalGroupMock.name,
      );
      assert(globalGroup);
      expect(globalGroup.depth).toBe(0);

      const allOtherGroupNames = accessGroups
        .map((g) => g.name)
        .filter((name) => name !== globalGroupMock.name);
      expect(globalGroup.children).toEqual(
        expect.arrayContaining(allOtherGroupNames),
      );

      const testGroup = options.find((opt) => opt.value === testGroupMock.name);
      assert(testGroup);

      expect(testGroup.depth).toBe(1);
      expect(testGroup.parents).toEqual([globalGroupMock.name]);
      expect(testGroup.children).toEqual(
        expect.arrayContaining([
          subTestGroupMock.name,
          subSubTestGroupMock.name,
        ]),
      );

      const subSubTestGroup = options.find(
        (opt) => opt.value === subSubTestGroupMock.name,
      );
      assert(subSubTestGroup);

      expect(subSubTestGroup.depth).toBe(3);
      expect(subSubTestGroup.parents).toEqual([
        subTestGroupMock.name,
        testGroupMock.name,
        globalGroupMock.name,
      ]);
    });

    it("should handle an empty array of access groups", () => {
      const options = getAccessGroupOptions([]);
      expect(options).toEqual([]);
    });

    it("should correctly identify root elements (depth 0)", () => {
      const options = getAccessGroupOptions(accessGroups);
      const rootOptions = options.filter((opt) => opt.depth === 0);

      assert(rootOptions[0]);

      expect(rootOptions.length).toBe(1);
      expect(rootOptions[0].value).toBe(globalGroupMock.name);
    });
  });

  describe("getSortedOptions", () => {
    it("should sort parents before children", () => {
      const options = getAccessGroupOptions(accessGroups);
      const sorted = getSortedOptions(options);
      const globalIndex = sorted.findIndex(
        (opt) => opt.value === globalGroupMock.name,
      );
      const testIndex = sorted.findIndex(
        (opt) => opt.value === testGroupMock.name,
      );
      const subTestIndex = sorted.findIndex(
        (opt) => opt.value === subTestGroupMock.name,
      );

      expect(globalIndex).toBeLessThan(testIndex);
      expect(testIndex).toBeLessThan(subTestIndex);
    });

    it("should sort siblings alphabetically", () => {
      const options = getAccessGroupOptions(accessGroups);
      const sorted = getSortedOptions(options);
      const desktopIndex = sorted.findIndex(
        (opt) => opt.value === desktopGroupMock.name,
      );
      const serverIndex = sorted.findIndex(
        (opt) => opt.value === serverGroupMock.name,
      );
      const testIndex = sorted.findIndex(
        (opt) => opt.value === testGroupMock.name,
      );

      expect(desktopIndex).toBeLessThan(serverIndex);
      expect(serverIndex).toBeLessThan(testIndex);
    });
  });

  describe("getAccessGroupsToSubmit", () => {
    it("should remove children if the parent and all its children are selected", () => {
      const options = getAccessGroupOptions(accessGroups);
      const selectedGroups = [
        testGroupMock.name,
        subTestGroupMock.name,
        subSubTestGroupMock.name,
      ];

      const result = getAccessGroupsToSubmit([...selectedGroups], options);
      expect(result).toEqual([testGroupMock.name]);
    });

    it("should NOT remove children if parent is selected but NOT ALL children are", () => {
      const options = getAccessGroupOptions(accessGroups);
      const selectedGroups = [globalGroupMock.name, serverGroupMock.name];
      const result = getAccessGroupsToSubmit([...selectedGroups], options);
      expect(result).toEqual(expect.arrayContaining(selectedGroups));
      expect(result.length).toBe(selectedGroups.length);
    });

    it("should handle nested cases correctly by simplifying to the highest-level parent", () => {
      const options = getAccessGroupOptions(accessGroups);
      const selectedGroups = [
        testGroupMock.name,
        subTestGroupMock.name,
        subSubTestGroupMock.name,
      ];
      const result = getAccessGroupsToSubmit([...selectedGroups], options);
      expect(result).toEqual([testGroupMock.name]);
    });

    it("should return an empty array if the input is empty", () => {
      const options = getAccessGroupOptions(accessGroups);
      const result = getAccessGroupsToSubmit([], options);
      expect(result).toEqual([]);
    });

    it("should not modify the list if no parent-child full selections exist", () => {
      const options = getAccessGroupOptions(accessGroups);
      const selectedGroups = [serverGroupMock.name, subTestGroupMock.name];
      const result = getAccessGroupsToSubmit([...selectedGroups], options);
      expect(result).toEqual(expect.arrayContaining(selectedGroups));
      expect(result.length).toBe(selectedGroups.length);
    });
  });
});
