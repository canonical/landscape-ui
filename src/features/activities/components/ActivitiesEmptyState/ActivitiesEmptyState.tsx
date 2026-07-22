import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { ACTIVITIES_DOCUMENTATION_URL } from "./constants";

const ActivitiesEmptyState: FC = () => {
  return (
    <EmptyState
      body="There are no activities yet."
      link={{
        href: ACTIVITIES_DOCUMENTATION_URL,
        text: "How to manage computers in Landscape",
      }}
      icon="switcher-environments"
      title="No activities found"
    />
  );
};

export default ActivitiesEmptyState;
