import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";

const PackageProfileHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default PackageProfileHeader;
