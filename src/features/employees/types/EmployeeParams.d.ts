interface EmployeeActionParams {
  id: number;
}

export interface GetEmployeesParams {
  with_groups?: boolean;
  with_autoinstall_file?: boolean;
  with_computers?: boolean;
}

export interface GetRecoveryKeyParams {
  fde_recovery_key: string;
}

export type DeleteEmployeeParams = EmployeeActionParams;

export type OffboardEmployeeParams = EmployeeActionParams;

export interface PatchEmployeeParams extends EmployeeActionParams {
  is_active: boolean;
}

export interface EmployeeActionWithInstanceParams {
  employee_id: number;
  computer_id: number;
}
