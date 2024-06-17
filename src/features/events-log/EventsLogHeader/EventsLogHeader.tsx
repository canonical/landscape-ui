import { Form, SearchBox, Select } from "@canonical/react-components";
import { ChangeEvent, FC, SyntheticEvent, useState } from "react";
import classes from "./EventsLogHeader.module.scss";
import { FILTERS } from "./constants";
import { usePageParams } from "@/hooks/usePageParams";

const EventsLogHeader: FC = () => {
  const { search, days, setPageParams } = usePageParams();

  const [searchText, setSearchText] = useState(search);

  const handleSearch = () => {
    setPageParams({
      search: searchText,
    });
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageParams({
      days: e.target.value,
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleSearch();
  };
  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            value={searchText}
            onChange={(inputValue) => {
              setSearchText(inputValue);
            }}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Form>
      </div>
      {FILTERS.days.type === "select" && (
        <Select
          wrapperClassName={classes.select}
          label={FILTERS.days.label}
          labelClassName="u-no-margin--bottom"
          options={FILTERS.days.options}
          value={days}
          onChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default EventsLogHeader;
