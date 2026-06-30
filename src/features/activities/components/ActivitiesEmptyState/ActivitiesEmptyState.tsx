import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { DOCUMENTATION_LINK } from "./constants";

const ActivitiesEmptyState: FC = () => {
  return (
    <EmptyState
      body="There are no activities yet."
      link={{
        href: DOCUMENTATION_LINK,
        text: "How to manage computers in Landscape",
      }}
      icon="switcher-environments"
      title="No activities found"
    />
  );
};

export default ActivitiesEmptyState;
