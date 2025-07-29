import type { Employee, RecoveryKey } from "@/features/employees";
import { instances } from "./instance";

export const employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    is_active: true,
    issuer: "https://myorg.okta.com",
    subject: "00u1x0f8xq6z2c0",
    autoinstall_file: {
      id: 1,
      created_at: "2021-09-01T00:00:00Z",
      events: [],
      filename: "high-security-policy.yaml",
      is_default: false,
      last_modified_at: "2021-09-01T00:00:00Z",
      version: 1,
      contents: "echo 'Hello World'",
    },
    computers: instances,
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
