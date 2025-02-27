/* eslint-disable @typescript-eslint/no-unused-vars */
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useState } from "react";
import { getEmployeeGroupOptions } from "../../helpers";
import type { EmployeeGroup } from "../../types";
import { useGetEmployeeGroups } from "../../api";

interface EmployeeGroupsFilterProps {
  readonly employeeGroupsData: EmployeeGroup[];
  readonly searchLabel: string;
}

const EmployeeGroupsFilter: FC<EmployeeGroupsFilterProps> = ({
  employeeGroupsData,
  searchLabel,
}) => {
  const [searchText, setSearchText] = useState("");

  const { employeeGroups, setPageParams } = usePageParams();

  // TODO implement when Spencer adds filtering
  const { employeeGroupsResult } = useGetEmployeeGroups(
    {
      search: searchText,
    },
    {
      enabled: !!searchText,
    },
  );

  // const { data: employeeGroupsQueryResult } = getEmployeeGroupsQuery(
  //   {
  //     search: searchText,
  //   },
  //   { enabled: !!searchText },
  // );

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
      searchLabel={searchLabel}
      selectedItems={employeeGroups}
    />
  );
};

export default EmployeeGroupsFilter;
