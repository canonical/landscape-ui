import type { FC } from "react";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { TableFilterChips } from "@/components/filter";

const WslProfilesHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default WslProfilesHeader;
