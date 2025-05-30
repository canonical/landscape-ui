import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import TableFilter from "../TableFilter";

interface StatusFilterProps {
  readonly options: SelectOption[];
  readonly onItemSelect?: () => void;
}

const StatusFilter: FC<StatusFilterProps> = ({
  onItemSelect = () => undefined,
  options,
}) => {
  const { setPageParams, status } = usePageParams();

  useSetDynamicFilterValidation(
    "status",
    options.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="single"
      label="Status"
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={(item) => {
        onItemSelect();
        setPageParams({ status: item });
      }}
      selectedItem={status}
    />
  );
};

export default StatusFilter;
