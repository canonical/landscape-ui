import type {
  EmployeeGroup,
  StagedOidcGroup,
} from "@/features/employee-groups";

export const employeeGroups: EmployeeGroup[] = [
  {
    id: 1,
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
    group_id: "923ijgbxvz21239fzz",
    name: "Engineering",
    priority: 2,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 3,
    group_id: "923ijgbxvz21239faa",
    name: "Engineering",
    priority: 2,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 4,
    group_id: "923ijgbxvz21239fbb",
    name: "Finance",
    priority: null,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
  {
    id: 5,
    group_id: "923ijgbxvz21239fcc",
    name: "Support",
    priority: null,
    autoinstall_file: null,
    employee_count: null,
    issuer_id: 0,
  },
];

export const stagedOidcGroups: StagedOidcGroup[] = [
  {
    id: 1,
    name: "Marketing",
    group_id: "akr019jvcvi2n2cv",
    import_session_id: 1,
    issuer_id: 2,
  },
  {
    id: 2,
    name: "Engineering",
    group_id: "923ijgbxvz21239fzz",
    import_session_id: 1,
    issuer_id: 2,
  },
  {
    id: 3,
    name: "Support",
    group_id: "37yfd712g43783f436",
    import_session_id: 1,
    issuer_id: 2,
  },
  {
    id: 4,
    name: "Testers",
    group_id: "jkt5b45hb54nj5t4",
    import_session_id: 1,
    issuer_id: 2,
  },
];
