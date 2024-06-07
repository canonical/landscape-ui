import { Form, SearchBox } from "@canonical/react-components";
import { FC, SyntheticEvent, useState } from "react";
import SnapsActions from "../SnapsActions";
import { InstalledSnap } from "@/types/Snap";
import { getSelectedSnaps } from "../helpers";
import classes from "./SnapsHeader.module.scss";
import { usePageParams } from "@/hooks/usePageParams";

interface SnapsHeaderProps {
  handleClearSelection: () => void;
  selectedSnapIds: string[];
  installedSnaps: InstalledSnap[];
}

const SnapsHeader: FC<SnapsHeaderProps> = ({
  handleClearSelection,
  selectedSnapIds,
  installedSnaps,
}) => {
  const { search, setPageParams } = usePageParams();

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
            aria-label="Snap search"
            onChange={(inputValue) => setSearchText(inputValue)}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        </Form>
      </div>
      <div className={classes.cta}>
        <SnapsActions
          selectedSnapIds={selectedSnapIds}
          installedSnaps={getSelectedSnaps(installedSnaps, selectedSnapIds)}
        />
      </div>
    </div>
  );
};

export default SnapsHeader;
