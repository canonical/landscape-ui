import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { MANAGE_INSTANCES_DOCUMENTATION_URL } from "./constants";

const InstancesEmptyState: FC = () => {
  return (
    <EmptyState
      title="No instances found"
      icon="connected"
      body="You don't have any instances registered to Landscape yet."
      link={{
        href: MANAGE_INSTANCES_DOCUMENTATION_URL,
        text: "How to manage instances in Landscape",
      }}
    />
  );
};

export default InstancesEmptyState;
