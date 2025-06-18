import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";

interface GroupFilterProps {
  readonly options: SelectOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const GroupFilter: FC<GroupFilterProps> = ({
  options,
  label,
  inline = false,
}) => {
  const { groupBy, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "groupBy",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        setPageParams({ groupBy: item });
      }}
      selectedItem={groupBy}
      inline={inline}
    />
  );
};

export default GroupFilter;
