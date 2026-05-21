import { PageParamFilter, TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import { type FC } from "react";
import classes from "./ScriptsHeader.module.scss";
import { STATUS_OPTIONS } from "./constants";

const ScriptsHeader: FC = () => {
  const { createSidePathPusher } = usePageParams();

  const handleScriptCreate = createSidePathPusher("create");

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
              onClick={handleScriptCreate}
              className="u-no-margin--bottom"
              hasIcon
            >
              <Icon name="plus" />
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
