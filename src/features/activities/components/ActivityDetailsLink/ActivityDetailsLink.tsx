import { Button } from "@canonical/react-ds-global";
import usePageParams from "@/hooks/usePageParams";
import type { FC, ReactNode } from "react";
import { useOpenActivityDetailsPanel } from "../../hooks";
import type { ActivityCommon } from "../../types";

interface ActivityDetailsLinkProps {
  readonly activity: Pick<ActivityCommon, "id" | "summary">;
  readonly children: ReactNode;
  readonly className?: string;
  readonly "aria-label"?: string;
}

const ActivityDetailsLink: FC<ActivityDetailsLinkProps> = ({
  activity,
  ...props
}) => {
  const openActivityDetails = useOpenActivityDetailsPanel();

  const { sidePath, closeSidePanel } = usePageParams();

  return (
    <Button
      type="button"
      variant="link"
      {...props}
      onClick={() => {
        if (sidePath.length) {
          closeSidePanel();
        }
        openActivityDetails(activity);
      }}
    />
  );
};

export default ActivityDetailsLink;
