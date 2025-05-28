import type { GroupedOption } from "@/components/filter";
import { TableFilter } from "@/components/filter";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useMemo, useState } from "react";

interface AutoinstallFilesFilterProps {
  readonly options: GroupedOption[];
}

const AutoinstallFilesFilter: FC<AutoinstallFilesFilterProps> = ({
  options,
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
      label="Autoinstall file"
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
    />
  );
};

export default AutoinstallFilesFilter;
