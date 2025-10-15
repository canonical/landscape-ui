import { TableFilter } from "@/components/filter";
import type { FilterProps } from "@/components/filter/types";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import type { PageParams } from "@/libs/pageParamsManager";
import type { FC } from "react";

interface PageParamFilterProps extends FilterProps {
  // This type is a union of all page params with string type
  readonly pageParamKey: {
    [K in keyof PageParams]: PageParams[K] extends string ? K : never;
  }[keyof PageParams];
}

const PageParamFilter: FC<PageParamFilterProps> = ({
  options,
  label,
  inline = false,
  pageParamKey,
}) => {
  const { setPageParams, ...pageParams } = usePageParams();

  useSetDynamicFilterValidation(
    pageParamKey,
    options.map((opt) => opt.value),
  );

  const handleItemSelect = (item: string) => {
    setPageParams({ [pageParamKey]: item });
  };

  return (
    <TableFilter
      type="single"
      label={label}
      hasToggleIcon
      hasBadge
      options={options}
      onItemSelect={handleItemSelect}
      selectedItem={pageParams[pageParamKey]}
      inline={inline}
    />
  );
};

export default PageParamFilter;
