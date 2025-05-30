import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";

interface OsFilterProps {
  readonly options: SelectOption[];
  readonly onItemSelect?: () => void;
}

const OsFilter: FC<OsFilterProps> = ({
  onItemSelect = () => undefined,
  options,
}) => {
  const { os, setPageParams } = usePageParams();

  useSetDynamicFilterValidation(
    "os",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      hasBadge
      label="OS"
      hasToggleIcon
      options={options}
      onItemSelect={(item) => {
        onItemSelect();
        setPageParams({ os: item });
      }}
      selectedItem={os}
    />
  );
};

export default OsFilter;
