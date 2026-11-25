import { ActivityDetailsLink } from "@/features/activities";
import type { User } from "@/types/User";

interface PendingUserActivityProps {
  readonly user: User;
}

const PendingUserActivity = ({ user }: PendingUserActivityProps) => {
  const activity = user.pending_activity;

  if (!activity) {
    return null;
  }

  const label = `Pending activity to ${activity.operation}`;

  return (
    <ActivityDetailsLink
      activity={{
        id: activity.activity_id,
        summary: activity.summary,
      }}
      className="u-no-margin--bottom"
      aria-label={`View ${label} for ${user.username}`}
    >
      {label}
    </ActivityDetailsLink>
  );
};

export default PendingUserActivity;
