import { Button } from "@canonical/react-components";
import usePageParams from "@/hooks/usePageParams";
import type { FC, ReactNode } from "react";
import { useOpenActivityDetailsPanel } from "../../hooks";
import type { ActivityCommon } from "../../types";

interface ActivityDetailsLinkProps {
  readonly activity: Pick<ActivityCommon, "id" | "summary">;
  readonly size?: "small" | "medium" | "large";
  readonly children: ReactNode;
  readonly className?: string;
  readonly "aria-label"?: string;
}

const ActivityDetailsLink: FC<ActivityDetailsLinkProps> = ({
  activity,
  size,
  ...props
}) => {
  const openActivityDetails = useOpenActivityDetailsPanel();

  const { sidePath, closeSidePanel } = usePageParams();

  return (
    <Button
      type="button"
      appearance="link"
      className="u-no-margin--bottom u-no-padding--top"
      {...props}
      onClick={() => {
        if (sidePath.length) {
          closeSidePanel();
        }
        openActivityDetails(activity, {
          size,
        });
      }}
    />
  );
};

export default ActivityDetailsLink;
