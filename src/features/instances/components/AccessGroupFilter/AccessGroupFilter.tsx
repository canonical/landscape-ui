import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

interface AccessGroupFilterProps {
  readonly options: GroupedOption[];
  readonly onItemSelect?: () => void;
}

const AccessGroupFilter: FC<AccessGroupFilterProps> = ({
  onItemSelect = () => undefined,
  options,
}) => {
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
        onItemSelect();
        setPageParams({ accessGroups: items });
      }}
      selectedItems={accessGroups}
    />
  );
};

export default AccessGroupFilter;
