import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";

interface GroupFilterProps {
  readonly options: SelectOption[];
}

const GroupFilter: FC<GroupFilterProps> = ({ options }) => {
  const { groupBy, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "groupBy",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      multiple={false}
      label="Group by"
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        setPageParams({ groupBy: item });
      }}
      selectedItem={groupBy}
    />
  );
};

export default GroupFilter;
