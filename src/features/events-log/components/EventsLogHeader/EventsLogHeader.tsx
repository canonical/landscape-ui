import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import DaysFilter from "../DaysFilter";

const EventsLogHeader: FC = () => {
  return (
    <>
      <HeaderWithSearch actions={<DaysFilter />} />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default EventsLogHeader;
