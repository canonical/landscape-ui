import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import DaysFilter from "../DaysFilter";

const EventsLogHeader: FC = () => {
  return <HeaderWithSearch actions={<DaysFilter />} />;
};

export default EventsLogHeader;
