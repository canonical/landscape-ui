import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import classes from "./AutoinstallFilesHeader.module.scss";

interface AutoinstallFilesHeaderProps {
  readonly openAddForm: () => void;
}

const AutoinstallFilesHeader: FC<AutoinstallFilesHeaderProps> = ({
  openAddForm,
}) => {
  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.container}>
            <Button
              type="button"
              className="u-no-margin"
              hasIcon
              onClick={openAddForm}
            >
              <Icon name="plus" />
              <span>Add new</span>
            </Button>
          </div>
        }
      />

      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default AutoinstallFilesHeader;
