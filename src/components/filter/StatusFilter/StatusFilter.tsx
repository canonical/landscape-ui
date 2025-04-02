import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { SelectOption } from "@/types/SelectOption";
import type { FC } from "react";
import TableFilter from "../TableFilter";

interface StatusFilterProps {
  readonly options: SelectOption[];
  readonly multiple?: boolean;
}

const StatusFilter: FC<StatusFilterProps> = ({ options, multiple = false }) => {
  const { setPageParams, statuses } = usePageParams();

  useSetDynamicFilterValidation(
    "statuses",
    options.map((opt) => opt.value),
  );

  if (!multiple) {
    return (
      <TableFilter
        multiple={false}
        label="Status"
        hasToggleIcon
        hasBadge
        options={options}
        onItemSelect={(item) => {
          setPageParams({ statuses: [item] });
        }}
        selectedItem={statuses[0]}
      />
    );
  }
  return (
    <TableFilter
      multiple={multiple}
      label="Status"
      hasToggleIcon
      hasBadge
      options={options}
      onItemsSelect={(item) => {
        setPageParams({ statuses: item });
      }}
      selectedItems={statuses}
    />
  );
};

export default StatusFilter;
