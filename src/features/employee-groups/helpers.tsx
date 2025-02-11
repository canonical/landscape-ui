import type { SelectOption } from "@/types/SelectOption";
import type { EmployeeGroup } from "./types";
import { Tooltip } from "@canonical/react-components";
import classes from "./components/EmployeeGroupsFilter/EmployeeGroupsFilter.module.scss";

export const isNotUnique = (employeeGroups: EmployeeGroup[], name: string) => {
  return employeeGroups.filter((employee) => employee.name === name).length > 1;
};

const getSuffix = (word: string): string => {
  return `(...${word.slice(-3)})`;
};

export const getEmployeeGroupLabel = (
  employeeGroup: EmployeeGroup,
  employeeGroups: EmployeeGroup[],
  includeTooltip = false,
): React.ReactNode => {
  const unique = !isNotUnique(employeeGroups, employeeGroup.name);
  const suffix = getSuffix(employeeGroup.group_id);

  if (includeTooltip && !unique) {
    return (
      <>
        <span>{employeeGroup.name} </span>
        <Tooltip
          positionElementClassName={classes.tooltipPositionElement}
          position="top-center"
          message={`group id: ${employeeGroup.group_id}`}
        >
          <span>{suffix}</span>
        </Tooltip>
      </>
    );
  }

  return !unique ? `${employeeGroup.name} ${suffix}` : employeeGroup.name;
};

export const getEmployeeGroupOptions = (
  employeeGroups: EmployeeGroup[],
  includeTooltip = false,
): SelectOption[] => {
  return employeeGroups.map((employeeGroup) => {
    const suffix = getSuffix(employeeGroup.group_id);

    const value = !isNotUnique(employeeGroups, employeeGroup.name)
      ? employeeGroup.name
      : `${employeeGroup.name} ${suffix}`;

    return {
      value,
      label: getEmployeeGroupLabel(
        employeeGroup,
        employeeGroups,
        includeTooltip,
      ),
    };
  });
};
