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

  const props = multiple
    ? {
        multiple,
        onItemsSelect: (item: string[]) => {
          setPageParams({ statuses: item });
        },
        selectedItems: statuses,
      }
    : {
        multiple,
        onItemSelect: (item: string) => {
          setPageParams({ statuses: [item] });
        },
        selectedItem: statuses[0],
      };

  return (
    <TableFilter
      label="Status"
      hasToggleIcon
      hasBadge
      options={options}
      {...props}
    />
  );
};

export default StatusFilter;
