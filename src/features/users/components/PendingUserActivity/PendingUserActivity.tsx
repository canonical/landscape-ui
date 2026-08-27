import { ROUTES } from "@/libs/routes";
import type { User } from "@/types/User";
import { Link } from "react-router";

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
    <Link
      to={ROUTES.activities.root({ query: `id:${activity.activity_id}` })}
      state={{
        activity: {
          id: activity.activity_id,
          summary: activity.summary,
        },
      }}
      className="u-no-margin--bottom"
      aria-label={`View ${label} for ${user.username}`}
    >
      {label}
    </Link>
  );
};

export default PendingUserActivity;