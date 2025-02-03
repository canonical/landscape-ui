import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface OsFilterProps {
  readonly options: SelectOption[];
}

const OsFilter: FC<OsFilterProps> = ({ options }) => {
  const { os, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "os",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      multiple={false}
      hasBadge
      label="OS"
      hasToggleIcon
      options={options}
      onItemSelect={(item) => setPageParams({ os: item })}
      selectedItem={os}
    />
  );
};

export default OsFilter;
