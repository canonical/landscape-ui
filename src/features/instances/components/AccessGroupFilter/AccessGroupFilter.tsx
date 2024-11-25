import { FC } from "react";
import { GroupedOption, TableFilter } from "@/components/filter";
import { usePageParams } from "@/hooks/usePageParams";

interface AccessGroupFilterProps {
  options: GroupedOption[];
}

const AccessGroupFilter: FC<AccessGroupFilterProps> = ({ options }) => {
  const { accessGroups, setPageParams } = usePageParams();

  return (
    <TableFilter
      multiple
      label="Access group"
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={(items) => setPageParams({ accessGroups: items })}
      selectedItems={accessGroups}
    />
  );
};

export default AccessGroupFilter;
