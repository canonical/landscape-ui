import type { FC } from "react";
import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface AccessGroupFilterProps {
  readonly options: GroupedOption[];
}

const AccessGroupFilter: FC<AccessGroupFilterProps> = ({ options }) => {
  const { accessGroups, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "accessGroups",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="multiple"
      label="Access group"
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={(items) => {
        setPageParams({ accessGroups: items });
      }}
      selectedItems={accessGroups}
    />
  );
};

export default AccessGroupFilter;
