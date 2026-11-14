import { ACTIVITY_STATUSES, ActivityDetailsLink } from "@/features/activities";
import type { FC } from "react";
import type { UserActivityEvent } from "../../types";

interface UserActivityLinkProps {
  readonly event: UserActivityEvent;
}

const UserActivityLink: FC<UserActivityLinkProps> = ({ event }) => {
  const status = ACTIVITY_STATUSES[event.activity_status].label;

  return (
    <span className="p-text--small">
      This field is pending to be changed by this activity:{" "}
      <ActivityDetailsLink
        activity={{
          id: event.activity_id,
          summary: event.summary,
        }}
        aria-label={`View activity ${event.activity_id}: ${status}`}
      >
        <span className="p-text--small">
          {event.summary}: <code>{status}</code>
        </span>
      </ActivityDetailsLink>
    </span>
  );
};

export default UserActivityLink;
