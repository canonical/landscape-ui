import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { MANAGING_COMPUTERS_DOCUMENTATION_URL } from "@/constants";

const ActivitiesEmptyState: FC = () => {
  return (
    <EmptyState
      body="There are no activities yet."
      link={{
        href: MANAGING_COMPUTERS_DOCUMENTATION_URL,
        text: "How to manage computers in Landscape",
      }}
      icon="switcher-environments"
      title="No activities found"
    />
  );
};

export default ActivitiesEmptyState;
