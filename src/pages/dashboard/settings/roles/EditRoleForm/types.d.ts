import { AxiosResponse } from "axios";
import { Role } from "@/types/Role";
import {
  AccessGroupOption,
  PermissionOption,
  RoleHandlers,
} from "@/pages/dashboard/settings/roles/types";

export interface FormProps {
  accessGroups: string[];
  permissions: string[];
}

type RoleParams = "AccessGroups" | "Permissions";

type RoleActions = "add" | "remove";

export type GetPromisesToEditRoleFn<
  T extends Promise<AxiosResponse<Role>> = Promise<AxiosResponse<Role>>,
> = (
  values: FormProps,
  role: Role,
  accessGroupOptions: AccessGroupOption[],
  permissionOptions: PermissionOption[],
  handlers: RoleHandlers<RoleActions, T>,
) => { [key in `${RoleActions}${RoleParams}` as `${key}Promise`]?: T };
