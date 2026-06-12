import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

interface ViewLogsButtonProps {
  readonly resource?: string;
}

const ViewLogsButton: FC<ViewLogsButtonProps> = ({ resource }) => {
  const { createPageParamsSetter, createSidePathPusher, sidePath } =
    usePageParams();

  const openSidePanel = (action: string) => {
    if (!sidePath.length) {
      return createPageParamsSetter({
        sidePath: [action],
        name: resource,
      });
    }
    return createSidePathPusher(action);
  };

  return (
    <Button
      className="u-no-margin--bottom u-no-padding--top"
      type="button"
      appearance="link"
      onClick={openSidePanel("logs")}
    >
      View logs
    </Button>
  );
};

export default ViewLogsButton;
