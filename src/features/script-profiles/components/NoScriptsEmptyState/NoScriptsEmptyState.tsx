import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";

const NoScriptsEmptyState: FC = () => {
  const { createSidePathPusher } = usePageParams();

  const addScript = createSidePathPusher("create");;

  return (
    <EmptyState
      title="You need at least one script to add a profile."
      body={
        <>
          <p>
            In order to create a script profile, you need to have added a script
            to your Landscape organization.
          </p>

          <Button
            type="button"
            appearance="positive"
            onClick={addScript}
            className="u-no-margin--bottom"
            hasIcon
          >
            <Icon name="plus" light />
            <span>Add script</span>
          </Button>
        </>
      }
    />
  );
};

export default NoScriptsEmptyState;
