export interface Employee extends Record<string, unknown> {
  id: number;
  // account_id: number;
  name: string;
  email: string;
  issuer: string;
  subject: string;
  is_active: boolean;
  // user_groups: string[];
  // autoinstall_file: string;
  // status: string;
  // associated_instances: AssociatedInstance[];
}

interface EmployeeInstance extends Record<string, unknown> {
  employee_id: number;
  computer_id: number;
  provision_date: string;
  autoinstall_file_filename: string;
  // id: number;
  // name: string;
  // status: string;
  // recovery_key: string;
}

export interface EmployeeGroup extends Record<string, unknown> {
  id: number;
  issuer: string;
  group_id: string;
  name: string;
  priority: number;
  autoinstall_file: string;
}

//TODO REMOVE
// interface AutoInstallFile {
//   account_id: number;
//   filename: Text;
//   is_default: boolean;
//   created_at:
// }

export interface RecoveryKey {
  fde_recovery_key: string;
}
