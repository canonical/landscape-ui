import { SelectOption } from "@/types/SelectOption";
import {
  ChangeRoleAccessGroupsParams,
  ChangeRolePermissionsParams,
} from "@/hooks/useRoles";

export interface AccessGroupOption extends SelectOption {
  children: string[];
  depth: number;
  parents: string[];
}

export interface PermissionOption extends Record<string, unknown> {
  global: boolean;
  label: string;
  values: { manage: string; view: string };
}

type RoleParams = "AccessGroups" | "Permissions";

export type RoleHandlers<Actions extends "add" | "remove", Return> = {
  [key in `${Actions}${RoleParams}`]: key extends `${string}Permissions`
    ? (args: ChangeRolePermissionsParams) => Return
    : (args: ChangeRoleAccessGroupsParams) => Return;
};
