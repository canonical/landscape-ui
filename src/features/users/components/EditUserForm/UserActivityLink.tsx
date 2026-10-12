import { ACTIVITY_STATUSES } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { Link } from "react-router";
import type { UserActivityEvent } from "../../types";

interface UserActivityLinkProps {
  readonly event: UserActivityEvent;
}

const UserActivityLink: FC<UserActivityLinkProps> = ({ event }) => {
  const { closeSidePanel } = useSidePanel();
  const status = ACTIVITY_STATUSES[event.activity_status].label;

  return (
    <span className="p-text--small">
      This field is pending to be changed by this activity:{" "}
      <Link
        to={ROUTES.activities.root({
          query: `id:${event.activity_id}`,
        })}
        state={{
          activity: {
            id: event.activity_id,
            summary: event.summary,
          },
        }}
        aria-label={`View activity ${event.activity_id}: ${status}`}
        onClick={closeSidePanel}
      >
        <span className="p-text--small">
          {event.summary}: <code>{status}</code>
        </span>
      </Link>
    </span>
  );
};

export default UserActivityLink;
