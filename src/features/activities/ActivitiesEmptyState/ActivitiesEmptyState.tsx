import { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";

const ActivitiesEmptyState: FC = () => {
  return (
    <EmptyState
      body={
        <>
          <p>There are no activities yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-computers"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage computers in Landscape
          </a>
        </>
      }
      icon="switcher-environments"
      title="No activities found"
    />
  );
};

export default ActivitiesEmptyState;
