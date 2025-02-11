import type {
  ConfigurationLimit,
  Employee,
  EmployeeGroup,
  RecoveryKey,
} from "@/features/employee-groups";

export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    is_active: true,
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c0",
    // associated_instances: [
    //   {
    //     id: 1,
    //     name: "Instance with a long name to trigger truncation",
    //     status: "running",
    //     recovery_key: "recovery-key1",
    //   },
    //   {
    //     id: 2,
    //     name: "Instance 2",
    //     status: "stopped",
    //     recovery_key: "recovery-key2",
    //   },
    // ],
    // autoinstall_file: "autoinstall_file",
    // status: "active",
    // user_groups: ["group1longlonglonglongasdasdasdasd", "group2"],
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "johndoe@gmail.com",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c1",
    is_active: false,
  },
  {
    id: 3,
    name: "Alice",
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c2",
    is_active: true,
    email: "alice@gmail.com",
  },
];

export const employeeGroups: EmployeeGroup[] = [
  {
    id: 1,
    issuer: "https://myorg.okta.com",
    group_id: "akr019jvcvi2n2cv",
    name: "Marketing",
    priority: 1,
    autoinstall_file: "high-security-policy.yaml",
  },
  {
    id: 2,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239fzz",
    name: "Engineering",
    priority: 2,
    autoinstall_file: "low-security-policy.yaml",
  },
  {
    id: 3,
    issuer: "https://myorg.okta.com",
    group_id: "923ijgbxvz21239faa",
    name: "Engineering",
    priority: 2,
    autoinstall_file: "low-security-policy.yaml",
  },
];

export const recoveryKey: RecoveryKey = {
  fde_recovery_key: "recovery-key",
};

export const configurationLimit: ConfigurationLimit = {
  limit: 100_000,
};
