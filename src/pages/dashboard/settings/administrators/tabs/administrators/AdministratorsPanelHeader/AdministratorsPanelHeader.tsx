import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";

const AdministratorsPanelHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default AdministratorsPanelHeader;
