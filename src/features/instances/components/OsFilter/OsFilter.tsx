import type { FC } from "react";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

interface OsFilterProps {
  readonly options: SelectOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const OsFilter: FC<OsFilterProps> = ({ options, label, inline = false }) => {
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
