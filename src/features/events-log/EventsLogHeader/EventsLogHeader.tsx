import { Form, SearchBox, Select } from "@canonical/react-components";
import { FC, SyntheticEvent, useState } from "react";
import classes from "./EventsLogHeader.module.scss";
import { DAY_OPTIONS } from "./constants";
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

  const handleFilterChange = (days: string) => {
    setPageParams({
      days: days,
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
      <Select
        wrapperClassName={classes.select}
        label="Days"
        labelClassName="u-no-margin--bottom"
        options={DAY_OPTIONS}
        value={days}
        onChange={(e) => handleFilterChange(e.target.value)}
      />
    </div>
  );
};

export default EventsLogHeader;
