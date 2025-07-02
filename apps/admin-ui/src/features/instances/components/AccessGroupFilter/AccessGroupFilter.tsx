import type { FC } from "react";
import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface AccessGroupFilterProps {
  readonly options: GroupedOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const AccessGroupFilter: FC<AccessGroupFilterProps> = ({
  options,
  label,
  inline = false,
}) => {
  const { accessGroups, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "accessGroups",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={(items) => {
        setPageParams({ accessGroups: items });
      }}
      selectedItems={accessGroups}
      inline={inline}
    />
  );
};

export default AccessGroupFilter;
