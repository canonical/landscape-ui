import { AxiosResponse } from "axios";
import { Role } from "@/types/Role";
import {
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
  T extends Promise<AxiosResponse<Role, any>> = Promise<
    AxiosResponse<Role, any>
  >,
> = (
  values: FormProps,
  accessGroupOptions: AccessGroupOption[],
  handlers: RoleHandlers<"add", T>,
) => T[];
