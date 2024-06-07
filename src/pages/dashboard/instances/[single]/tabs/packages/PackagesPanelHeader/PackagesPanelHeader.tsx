import { FC, SyntheticEvent, useState } from "react";
import { Form, SearchBox, Select } from "@canonical/react-components";
import classes from "./PackagesPanelHeader.module.scss";
import PackageActions from "@/pages/dashboard/instances/[single]/tabs/packages/PackageActions";
import { Package } from "@/types/Package";
import { filterOptions } from "./constants";
import { usePageParams } from "@/hooks/usePageParams";

interface PackagesPanelHeaderProps {
  handleClearSelection: () => void;
  selectedPackages: Package[];
}

const PackagesPanelHeader: FC<PackagesPanelHeaderProps> = ({
  handleClearSelection,
  selectedPackages,
}) => {
  const { search, setPageParams, status } = usePageParams();

  const [searchText, setSearchText] = useState(search);

  const handleSearch = () => {
    setPageParams({
      search: searchText,
    });
    handleClearSelection();
  };

  const handleClear = () => {
    setPageParams({
      search: "",
    });
  };

  const handleFilterChange = (newStatus: string) => {
    setPageParams({
      status: newStatus,
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
            shouldRefocusAfterReset
            externallyControlled
            autocomplete="off"
            value={searchText}
            onChange={(inputValue) => setSearchText(inputValue)}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Form>
      </div>
      <Select
        label="Status"
        wrapperClassName={classes.selectContainer}
        options={filterOptions}
        value={status}
        onChange={(event) => handleFilterChange(event.target.value)}
      />
      <div className={classes.cta}>
        <PackageActions selectedPackages={selectedPackages} />
      </div>
    </div>
  );
};

export default PackagesPanelHeader;
