import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";

const OsFilter: FC<FilterProps> = ({ options, label, inline = false }) => {
  const { os, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "os",
    options.flatMap((opt) => [
      opt.value,
      ...(opt.options?.map((nestedOpt) => nestedOpt.value) ?? []),
    ]),
  );

  return (
    <TableFilter
      type="multiple"
      hasBadge
      label={label}
      hasToggleIcon
      options={options}
      onItemsSelect={(items) => {
        setPageParams({ os: items });
      }}
      selectedItems={os}
      inline={inline}
    />
  );
};

export default OsFilter;
