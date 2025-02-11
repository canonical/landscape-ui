import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";
import { getEmployeeGroupOptions } from "../../helpers";
import type { EmployeeGroup } from "../../types";

interface EmployeeGroupsFilterProps {
  readonly employeeGroupsData: EmployeeGroup[];
}

const EmployeeGroupsFilter: FC<EmployeeGroupsFilterProps> = ({
  employeeGroupsData,
}) => {
  const [searchText, setSearchText] = useState("");

  const { employeeGroups, setPageParams } = usePageParams();

  const searchFilteredOptions = employeeGroupsData.filter(({ name }) =>
    name.includes(searchText),
  );

  const filteredOptions = getEmployeeGroupOptions(searchFilteredOptions, true);

  return (
    <TableFilter
      multiple
      hasBadge
      label="Employee group"
      hasToggleIcon
      options={filteredOptions}
      onItemsSelect={(items) => setPageParams({ employeeGroups: items })}
      onSearch={(search) => setSearchText(search)}
      selectedItems={employeeGroups}
    />
  );
};

export default EmployeeGroupsFilter;
