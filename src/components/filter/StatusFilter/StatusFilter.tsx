import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import TableFilter from "../TableFilter";

interface StatusFilterProps {
  readonly options: SelectOption[];
  readonly label: string;
  readonly inline?: boolean;
}

const StatusFilter: FC<StatusFilterProps> = ({
  options,
  label,
  inline = false,
}) => {
  const { setPageParams, status } = usePageParams();

  useSetDynamicFilterValidation(
    "status",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        setPageParams({ status: item });
      }}
      selectedItem={status}
      inline={inline}
    />
  );
};

export default StatusFilter;
