import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const UpgradesFilter: FC<FilterProps> = ({
  label,
  options,
  inline = false,
  onChange,
}) => {
  const { upgrades, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "upgrades",
    options.map((option) => option.value),
  );

  const handleItemsSelect = (items: string[]) => {
    setPageParams({ upgrades: items });
    onChange?.();
  };

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={handleItemsSelect}
      selectedItems={upgrades}
      inline={inline}
    />
  );
};

export default UpgradesFilter;
