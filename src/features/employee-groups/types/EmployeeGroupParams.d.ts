export interface GetEmployeeGroupsParams {
  with_employee_count?: boolean;
  with_autoinstall_file?: boolean;
}

export interface DeleteEmployeeGroupsParams {
  ids: number[];
}
