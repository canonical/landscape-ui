import { Select } from "@canonical/react-components";
import { ChangeEvent, FC } from "react";
import classes from "./EventsLogHeader.module.scss";
import { FILTERS } from "./constants";
import { usePageParams } from "@/hooks/usePageParams";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";

const EventsLogHeader: FC = () => {
  const { days, setPageParams } = usePageParams();

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageParams({
      days: e.target.value,
    });
  };

  return (
    <HeaderWithSearch
      onSearch={handleSearch}
      actions={
        FILTERS.days.type === "select" && (
          <Select
            wrapperClassName={classes.select}
            label={FILTERS.days.label}
            labelClassName="u-no-margin--bottom"
            options={FILTERS.days.options}
            value={days}
            onChange={handleFilterChange}
          />
        )
      }
    />
  );
};

export default EventsLogHeader;
