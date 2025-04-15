interface EmployeeActionParams {
  id: number;
}

interface CommonEmployeeParams {
  with_groups?: boolean;
  with_autoinstall_file?: boolean;
  with_computers?: boolean;
  search?: string;
  employee_group_ids?: string[];
  autoinstall_file_ids?: string[];
  is_active?: boolean;
}

export interface GetEmployeeParams extends CommonEmployeeParams {
  id: number;
}

export interface GetEmployeesParams extends CommonEmployeeParams {
  search?: string;
}

export type DeleteEmployeeParams = EmployeeActionParams;

export interface OffboardEmployeeParams extends EmployeeActionParams {
  sanitize_instances: boolean;
  remove_instances: boolean;
}

export interface PatchEmployeeParams extends EmployeeActionParams {
  is_active: boolean;
}

export interface EmployeeActionWithInstanceParams {
  employee_id: number;
  computer_id: number;
}
