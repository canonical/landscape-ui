export interface Role extends Record<string, unknown> {
  access_groups: string[];
  description: string;
  global_permissions: string[];
  key: number;
  name: string;
  permissions: string[];
  persons: string[];
}
