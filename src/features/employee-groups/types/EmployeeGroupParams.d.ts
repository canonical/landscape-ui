export interface GetEmployeeGroupsParams {
  with_employee_count?: boolean;
  with_autoinstall_file?: boolean;
  search?: string;
}

export interface DeleteEmployeeGroupsParams {
  ids: number[];
}

interface PatchEmployeeGroup {
  id: number;
  priority: number;
  autoinstall_file_id: string;
}

export interface PatchEmployeeGroupsParams {
  requests: PatchEmployeeGroup[];
}
