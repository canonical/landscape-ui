import { Form, SearchBox } from "@canonical/react-components";
import { FC, SyntheticEvent, useState } from "react";
import SnapsActions from "../SnapsActions";
import { InstalledSnap } from "@/types/Snap";
import { getSelectedSnaps } from "../helpers";
import classes from "./SnapsHeader.module.scss";

interface SnapsHeaderProps {
  instanceId: number;
  onSnapsSearchChange: (searchText: string) => void;
  selectedSnapIds: string[];
  installedSnaps: InstalledSnap[];
}

const SnapsHeader: FC<SnapsHeaderProps> = ({
  instanceId,
  onSnapsSearchChange,
  selectedSnapIds,
  installedSnaps,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    onSnapsSearchChange(searchText);
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
            onSearch={() => onSnapsSearchChange(searchText)}
            onClear={() => {
              setSearchText("");
              onSnapsSearchChange("");
            }}
          />
        </Form>
      </div>
      <div className={classes.cta}>
        <SnapsActions
          instanceId={instanceId}
          selectedSnapIds={selectedSnapIds}
          installedSnaps={getSelectedSnaps(installedSnaps, selectedSnapIds)}
        />
      </div>
    </div>
  );
};

export default SnapsHeader;
