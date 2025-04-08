import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import type { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import { SingleScript } from "@/features/scripts";
import classes from "./ScriptsHeader.module.scss";
import { statusOptions } from "./constants";

const ScriptsHeader: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent("Add script", <SingleScript action="add" />);
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.actions}>
            <StatusFilter options={statusOptions} />
            <Button
              type="button"
              appearance="positive"
              onClick={handleScriptCreate}
              className="u-no-margin--bottom"
              hasIcon
            >
              <Icon name="plus" light />
              <span>Add script</span>
            </Button>
          </div>
        }
      />
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default ScriptsHeader;
