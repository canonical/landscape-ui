import { FC } from "react";
import { TableFilter } from "@/components/filter";
import { usePageParams } from "@/hooks/usePageParams";
import { SelectOption } from "@/types/SelectOption";

interface OsFilterProps {
  options: SelectOption[];
}

const OsFilter: FC<OsFilterProps> = ({ options }) => {
  const { os, setPageParams } = usePageParams();

  return (
    <TableFilter
      multiple={false}
      hasBadge
      label="OS"
      hasToggleIcon
      options={options}
      onItemSelect={(item) => setPageParams({ os: item })}
      selectedItem={os}
    />
  );
};

export default OsFilter;
