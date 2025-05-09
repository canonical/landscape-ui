import { StatusFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import { lazy, Suspense, type FC } from "react";
import classes from "./ScriptsHeader.module.scss";
import { STATUS_OPTIONS } from "./constants";
import LoadingState from "@/components/layout/LoadingState";

const CreateScriptForm = lazy(async () => import("../CreateScriptForm"));

const ScriptsHeader: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <CreateScriptForm />
      </Suspense>,
    );
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.actions}>
            <StatusFilter options={STATUS_OPTIONS} />
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
      <TableFilterChips
        filtersToDisplay={["search", "status"]}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default ScriptsHeader;
