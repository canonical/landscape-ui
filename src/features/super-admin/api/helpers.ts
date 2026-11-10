/** The path of `resource` under the staff routes of the account named `name`. */
export const getStaffAccountPath = (name: string, resource: string): string =>
  `accounts/${encodeURIComponent(name)}/${resource}`;
