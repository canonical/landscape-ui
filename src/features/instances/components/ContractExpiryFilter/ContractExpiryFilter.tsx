import type { FC } from "react";
import PageParamFilter from "@/components/filter/PageParamFilter";
import type { FilterProps } from "@/components/filter/types";

const ContractExpiryFilter: FC<FilterProps> = ({
  options,
  label,
  inline = false,
}) => {
  return (
    <PageParamFilter
      pageParamKey="contractExpiryDays"
      label={label}
      options={options}
      inline={inline}
    />
  );
};

export default ContractExpiryFilter;
