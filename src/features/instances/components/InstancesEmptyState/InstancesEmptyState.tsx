import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";

const InstancesEmptyState: FC = () => {
  return (
    <EmptyState
      title="No instances found"
      icon="connected"
      body="You don't have any instances registered to Landscape yet."
      link={{
        href: "https://documentation.ubuntu.com/landscape/how-to-guides/landscape-installation-and-set-up/configure-landscape-client/",
        text: "How to manage instances in Landscape",
      }}
    />
  );
};

export default InstancesEmptyState;
