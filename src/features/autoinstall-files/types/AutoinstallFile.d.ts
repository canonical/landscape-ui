export interface AutoinstallFile extends Record<string, unknown> {
  name: string;
  employeeGroupsAssociated: string[];
  lastModified: string;
  dateCreated: string;
  version: number;
}
