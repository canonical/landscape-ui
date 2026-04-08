import type { AxiosResponse } from "axios";
import type { Role } from "@/types/Role";
import type {
  AccessGroupOption,
  RoleHandlers,
} from "@/pages/dashboard/settings/roles/types";

export interface FormProps {
  access_groups: string[];
  description: string;
  name: string;
  permissions: string[];
}

export type GetPromisesToAddRoleFn<
  T extends Promise<AxiosResponse<Role>> = Promise<AxiosResponse<Role>>,
> = (
  values: FormProps,
  accessGroupOptions: AccessGroupOption[],
  handlers: RoleHandlers<"add", T>,
) => T[];
