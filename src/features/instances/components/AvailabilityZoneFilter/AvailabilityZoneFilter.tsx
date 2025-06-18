import type { FC } from "react";
import { useState } from "react";
import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import type { FilterProps } from "@/components/filter/types";

const AvailabilityZoneFilter: FC<FilterProps<GroupedOption>> = ({
  options,
  label,
  inline = false,
}) => {
  const [searchText, setSearchText] = useState("");

  const { availabilityZones, setPageParams } = usePageParams();

  const filteredOptions =
    options.length > 9 && searchText
      ? options.filter(
          ({ value }) => value !== "none" && value.includes(searchText),
        )
      : options;

  useSetDynamicFilterValidation(
    "availabilityZones",
    filteredOptions.map((opt) => opt.value),
  );

  const handleItemsSelect = (items: string[]) => {
    if (items[items.length - 1] === "none") {
      setPageParams({ availabilityZones: ["none"] });
    } else {
      setPageParams({
        availabilityZones:
          items[0] !== "none" ? items : items.filter((item) => item !== "none"),
      });
    }
  };

  return (
    <TableFilter
      type="multiple"
      label={label}
      hasToggleIcon
      hasBadge
      onSearch={
        options.length > 9
          ? (search) => {
              setSearchText(search);
            }
          : undefined
      }
      options={filteredOptions}
      onItemsSelect={handleItemsSelect}
      selectedItems={availabilityZones}
      inline={inline}
    />
  );
};

export default AvailabilityZoneFilter;
