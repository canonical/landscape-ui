interface EmployeeActionParams {
  id: number;
}

interface CommonEmployeeParams {
  with_computers?: boolean;
  search?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
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
