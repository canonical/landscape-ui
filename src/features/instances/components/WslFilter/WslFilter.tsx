import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const WslFilter: FC<FilterProps> = ({ label, options, inline = false }) => {
  const { wsl, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("wsl", ["parent", "child"]);

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={(items) => {
        setPageParams({ wsl: items });
      }}
      selectedItems={wsl}
      inline={inline}
    />
  );
};

export default WslFilter;
