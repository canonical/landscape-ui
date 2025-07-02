import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { FilterProps } from "@/components/filter/types";

const AutoinstallFilesFilter: FC<FilterProps<GroupedOption>> = ({
  options,
  label,
  inline = false,
}) => {
  const [searchText, setSearchText] = useState("");

  const { autoinstallFiles, setPageParams } = usePageParams();

  const filteredOptions = useMemo(() => {
    return options.filter(({ label }) =>
      label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [options, searchText]);

  useSetDynamicFilterValidation(
    "autoinstallFiles",
    filteredOptions.map((opt) => opt.value),
  );

  return (
    <TableFilter
      type="multiple"
      hasBadge
      label={label}
      hasToggleIcon
      options={filteredOptions}
      onItemsSelect={(items) => {
        setPageParams({ autoinstallFiles: items });
      }}
      onSearch={(search) => {
        setSearchText(search);
      }}
      selectedItems={autoinstallFiles}
      hideSelectAllButton
      inline={inline}
    />
  );
};

export default AutoinstallFilesFilter;
