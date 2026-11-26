import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-ds-global";
import type { FC } from "react";

interface ViewLogsButtonProps {
  readonly resource?: string;
}

const ViewLogsButton: FC<ViewLogsButtonProps> = ({ resource }) => {
  const { createPageParamsSetter, createSidePathPusher } = usePageParams();

  const openSidePanel = (action: string) => {
    if (resource) {
      return createPageParamsSetter({
        sidePath: [action],
        name: resource,
      });
    }
    return createSidePathPusher(action);
  };

  return (
    <Button type="button" variant="link" onClick={openSidePanel("logs")}>
      View logs
    </Button>
  );
};

export default ViewLogsButton;
