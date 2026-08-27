import { ACTIVITY_STATUSES } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useNavigate } from "react-router";
import type { UserActivityEvent } from "../../api";

interface UserActivityLinkProps {
  readonly event: UserActivityEvent;
}

const UserActivityLink: FC<UserActivityLinkProps> = ({ event }) => {
  const navigate = useNavigate();
  const { closeSidePanel } = useSidePanel();
  const status = ACTIVITY_STATUSES[event.activity_status].label;

  return (
    <p className="p-text--small u-no-margin--bottom">
      This field is pending to be changed by this activity:{" "}
      <Button
        type="button"
        appearance="link"
        aria-label={`View activity ${event.activity_id}: ${status}`}
        onClick={() => {
          closeSidePanel();
          navigate(
            ROUTES.activities.root({
              query: `id:${event.activity_id}`,
            }),
            {
              state: {
                activity: {
                  id: event.activity_id,
                  summary: event.summary,
                },
              },
            },
          );
        }}
      >
        <span className="p-text--small">
          {event.summary}: <code>{status}</code>
        </span>
      </Button>
    </p>
  );
};

export default UserActivityLink;
