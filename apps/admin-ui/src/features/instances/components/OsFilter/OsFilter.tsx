import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import type { FilterProps } from "@/components/filter/types";

const OsFilter: FC<FilterProps> = ({ options, label, inline = false }) => {
  const { os, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "os",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      hasBadge
      label={label}
      hasToggleIcon
      options={options}
      onItemSelect={(item) => {
        setPageParams({ os: item });
      }}
      selectedItem={os}
      inline={inline}
    />
  );
};

export default OsFilter;
