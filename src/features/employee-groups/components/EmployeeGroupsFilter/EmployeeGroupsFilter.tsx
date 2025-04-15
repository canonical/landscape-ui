import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { type FC, useMemo, useState } from "react";

interface EmployeeGroupsFilterProps {
  readonly options: GroupedOption[];
}

const EmployeeGroupsFilter: FC<EmployeeGroupsFilterProps> = ({ options }) => {
  const [searchText, setSearchText] = useState("");

  const { employeeGroups, setPageParams } = usePageParams();

  const filteredOptions = useMemo(() => {
    return options.filter(({ label }) =>
      label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [options, searchText]);

  useSetDynamicFilterValidation(
    "employeeGroups",
    filteredOptions.map((opt) => opt.value),
  );

  const handleOnItemsSelect = (items: string[]) => {
    setPageParams({ employeeGroups: items });
  };

  return (
    <TableFilter
      multiple
      hasBadge
      label="Employee group"
      hasToggleIcon
      options={filteredOptions}
      onItemsSelect={handleOnItemsSelect}
      onSearch={(search: string) => {
        setSearchText(search);
      }}
      selectedItems={employeeGroups}
      hideSelectAllButton
    />
  );
};

export default EmployeeGroupsFilter;
