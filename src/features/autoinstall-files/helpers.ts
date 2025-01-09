import { AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS } from "./components/AutoinstallFilesHeader/constants";

export const createEmployeeGroupString = (employeeGroups: string[]) => {
  return employeeGroups
    .map((employeeGroup) => {
      return AUTOINSTALL_FILE_EMPLOYEE_GROUP_OPTIONS.find(({ value }) => {
        return value === employeeGroup;
      })?.label;
    })
    .join(", ");
};
