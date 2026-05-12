import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const VALID_BANDS = ["critical", "warning", "healthy"];

const HealthBandFilter: FC<FilterProps> = ({
  label,
  options,
  inline = false,
  onChange,
}) => {
  const { healthBand, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("healthBand", VALID_BANDS);

  const handleItemsSelect = (items: string[]) => {
    setPageParams({ healthBand: items });
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
      selectedItems={healthBand}
      inline={inline}
    />
  );
};

export default HealthBandFilter;
