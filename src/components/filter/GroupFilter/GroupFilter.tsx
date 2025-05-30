import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";

interface GroupFilterProps {
  readonly options: SelectOption[];
  readonly onItemSelect?: () => void;
}

const GroupFilter: FC<GroupFilterProps> = ({
  onItemSelect = () => undefined,
  options,
}) => {
  const { groupBy, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "groupBy",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label="Group by"
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        onItemSelect();
        setPageParams({ groupBy: item });
      }}
      selectedItem={groupBy}
    />
  );
};

export default GroupFilter;
