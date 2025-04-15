import type { GroupedOption } from "@/components/filter";
import { Tooltip } from "@canonical/react-components";
import classes from "./components/EmployeeGroupsFilter/EmployeeGroupsFilter.module.scss";
import type { EmployeeGroup, StagedOidcGroup } from "./types";

const isNotUnique = (
  employeeGroups: EmployeeGroup[] | StagedOidcGroup[],
  name: string,
) => {
  return employeeGroups.filter((employee) => employee.name === name).length > 1;
};

const getSuffix = (word: string): string => {
  return `(...${word.slice(-3)})`;
};

/**
 * This function is currently NOT used. The backend does not provide the uniqueness of a group in its paginated response.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEmployeeGroupLabel = <T extends boolean>(
  employeeGroup: EmployeeGroup,
  employeeGroups: EmployeeGroup[],
  includeTooltip?: T,
): T extends true ? React.ReactNode : string => {
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
    ) as T extends true ? React.ReactNode : string;
  }

  return (
    !unique ? `${employeeGroup.name} ${suffix}` : employeeGroup.name
  ) as T extends true ? React.ReactNode : string;
};

export const getEmployeeGroupOptions = (
  employeeGroups: EmployeeGroup[],
): GroupedOption[] => {
  return employeeGroups.map((employeeGroup) => {
    return {
      value: employeeGroup.id.toString(),
      label: employeeGroup.name,
    };
  });
};
