import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { PACKAGE_STATUS_OPTIONS } from "@/features/packages";
import type { FC } from "react";

const SupportInstancePackagesHeader: FC = () => (
  <>
    <HeaderWithSearch
      actions={
        <PageParamFilter
          pageParamKey="status"
          options={PACKAGE_STATUS_OPTIONS}
          label="Status"
        />
      }
    />
    <TableFilterChips
      filtersToDisplay={["status"]}
      statusOptions={PACKAGE_STATUS_OPTIONS}
    />
  </>
);

export default SupportInstancePackagesHeader;
