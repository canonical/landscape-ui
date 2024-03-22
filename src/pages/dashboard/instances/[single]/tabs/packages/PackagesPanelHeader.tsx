import { FC, SyntheticEvent, useState } from "react";
import { Form, SearchBox, Select } from "@canonical/react-components";
import classes from "./PackagesPanelHeader.module.scss";
import PackageActions from "./PackageActions";
import { SelectOption } from "../../../../../../types/SelectOption";
import { Package } from "../../../../../../types/Package";
import { Instance } from "@/types/Instance";

const filterOptions: SelectOption[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Installed",
    value: "installed",
  },
  {
    label: "Upgrades",
    value: "upgrade",
  },
  {
    label: "Held",
    value: "held",
  },
];

interface PackagesPanelHeaderProps {
  filter: string;
  instance: Instance;
  onFilterChange: (newFilter: string) => void;
  onPackageSearchChange: (searchText: string) => void;
  selectedPackages: Package[];
}

const PackagesPanelHeader: FC<PackagesPanelHeaderProps> = ({
  filter,
  instance,
  onFilterChange,
  onPackageSearchChange,
  selectedPackages,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onPackageSearchChange(searchText);
  };

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Form onSubmit={handleSubmit} noValidate>
          <SearchBox
            shouldRefocusAfterReset
            externallyControlled
            value={searchText}
            onChange={(inputValue) => {
              setSearchText(inputValue);
            }}
            onSearch={() => {
              onPackageSearchChange(searchText);
            }}
            onClear={() => {
              setSearchText("");
              onPackageSearchChange("");
            }}
            autocomplete="off"
          />
        </Form>
      </div>
      <Select
        label="Status"
        wrapperClassName={classes.selectContainer}
        options={filterOptions}
        value={filter}
        onChange={(event) => {
          onFilterChange(event.target.value);
        }}
      />
      <div className={classes.cta}>
        <PackageActions
          selectedPackages={selectedPackages}
          instance={instance}
        />
      </div>
    </div>
  );
};

export default PackagesPanelHeader;
