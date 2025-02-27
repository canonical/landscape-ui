import type {
  ConfigurationLimit,
  EmployeeGroup,
} from "@/features/employee-groups";
import type { Employee, RecoveryKey } from "@/features/employees";
import { instances } from "./instance";

export const employeeGroups: EmployeeGroup[] = [
  {
    id: 1,
    issuer: "https://myorg.okta.com",
    group_id: "akr019jvcvi2n2cv",
    name: "Marketing",
    priority: 1,
    autoinstall_file: {
      dateCreated: "2021-09-01T00:00:00Z",
      id: 1,
      employeeGroupsAssociated: ["Marketing"],
      name: "high-security-policy.yaml",
      events: [],
      filename: "high-security-policy.yaml",
      is_default: false,
      lastModified: "2021-09-01T00:00:00Z",
      version: 1,
    },
    employee_count: 5,
    issuer_id: 0,
  },
  {
    id: 2,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239fzz",
    name: "Engineering",
    priority: 2,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 3,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239faa",
    name: "Engineering",
    priority: 2,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 4,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239fbb",
    name: "Finance",
    priority: 3,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 5,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239fcc",
    name: "Support",
    priority: 4,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
];

export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    is_active: true,
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c0",
    autoinstall_file: {
      dateCreated: "2021-09-01T00:00:00Z",
      employeeGroupsAssociated: ["Marketing"],
      events: [],
      filename: "high-security-policy.yaml",
      is_default: false,
      lastModified: "2021-09-01T00:00:00Z",
      version: 1,
    },
    computers: instances,
    groups: employeeGroups,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "janedoe@gmail.com",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c1",
    is_active: false,
    autoinstall_file: null,
    computers: null,
    groups: null,
  },
  {
    id: 3,
    name: "Alice",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c2",
    is_active: true,
    email: "alice@gmail.com",
    autoinstall_file: null,
    computers: null,
    groups: null,
  },
];

export const recoveryKey: RecoveryKey = {
  fde_recovery_key: "recovery-key",
};

export const configurationLimit: ConfigurationLimit = {
  limit: 100_000,
};
