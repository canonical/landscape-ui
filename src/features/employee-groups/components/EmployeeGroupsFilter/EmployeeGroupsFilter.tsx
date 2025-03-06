import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";
import { getEmployeeGroupOptions } from "../../helpers";
import type { EmployeeGroup } from "../../types";

interface EmployeeGroupsFilterProps {
  readonly employeeGroupsData: EmployeeGroup[];
  readonly searchLabel: string;
}

const EmployeeGroupsFilter: FC<EmployeeGroupsFilterProps> = ({
  employeeGroupsData,
  searchLabel,
}) => {
  const [searchText, setSearchText] = useState("");

  const { employeeGroups: employeeGroupsParam, setPageParams } =
    usePageParams();

  // TODO: implement server-side search when the API is ready
  const searchFilteredOptions = employeeGroupsData.filter(({ name }) =>
    name.toLowerCase().includes(searchText.toLowerCase()),
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
      searchLabel={searchLabel}
      selectedItems={employeeGroupsParam}
    />
  );
};

export default EmployeeGroupsFilter;
