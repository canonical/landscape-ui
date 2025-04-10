export interface GetEmployeeGroupsParams {
  with_employee_count?: boolean;
  with_autoinstall_file?: boolean;
  name?: string;
  offset?: number;
  limit?: number;
  employee_group_ids?: string[];
  autoinstall_file_ids?: string[];
}

export interface DeleteEmployeeGroupsParams {
  ids: number[];
}
