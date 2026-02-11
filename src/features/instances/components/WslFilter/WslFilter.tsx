import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const WslFilter: FC<FilterProps> = ({
  label,
  options,
  inline = false,
  onChange,
}) => {
  const { wsl, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("wsl", ["parent", "child"]);

  const handleItemsSelect = (items: string[]) => {
    setPageParams({ wsl: items });
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
      selectedItems={wsl}
      inline={inline}
    />
  );
};

export default WslFilter;
