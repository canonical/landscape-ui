import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-ds-global";
import { type FC, lazy, Suspense } from "react";
import classes from "./ScriptsHeader.module.scss";
import { STATUS_OPTIONS } from "./constants";

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
            <PageParamFilter
              pageParamKey="status"
              options={STATUS_OPTIONS}
              label="Status"
            />
            <Button
              type="button"
              importance="secondary"
              icon="plus"
              onClick={handleScriptCreate}
            >
              Add script
            </Button>
          </div>
        }
      />
      <TableFilterChips
        filtersToDisplay={["status"]}
        statusOptions={STATUS_OPTIONS}
      />
    </>
  );
};

export default ScriptsHeader;
