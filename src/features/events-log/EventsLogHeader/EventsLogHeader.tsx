import { Form, SearchBox, Select } from "@canonical/react-components";
import { FC, SyntheticEvent, useState } from "react";
import classes from "./EventsLogHeader.module.scss";
import { DAY_OPTIONS } from "./constants";

interface EventsLogHeaderProps {
  setSearch: (newSearchQuery: string) => void;
  handleResetPage: () => void;
  dayFilter: number;
  handleDayChange: (newDay: number) => void;
}

const EventsLogHeader: FC<EventsLogHeaderProps> = ({
  setSearch,
  handleResetPage,
  dayFilter,
  handleDayChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const handleSearch = () => {
    setSearch(searchText);
    handleResetPage();
  };
  const handleClear = () => {
    setSearchText("");
    handleResetPage();
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
        value={dayFilter}
        onChange={(e) => handleDayChange(Number(e.target.value))}
      />
    </div>
  );
};

export default EventsLogHeader;
