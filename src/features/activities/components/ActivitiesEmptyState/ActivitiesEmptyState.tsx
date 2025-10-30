import type { FC } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { DOCUMENTATION_LINK } from "./constants";

const ActivitiesEmptyState: FC = () => {
  return (
    <EmptyState
      body={
        <>
          <p>There are no activities yet.</p>
          <a
            href={DOCUMENTATION_LINK}
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
