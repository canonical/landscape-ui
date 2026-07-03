import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";

const InstanceEmptyState: FC = () => {
  return (
    <EmptyState
      title="No instances found"
      icon="connected"
      body="You don't have any instances registered to Landscape yet."
      link={{
        href: "https://documentation.ubuntu.com/landscape/how-to-guides/web-portal/classic-web-portal/manage-computers/",
        text: "How to manage instances in Landscape",
      }}
    />
  );
};

export default InstanceEmptyState;
