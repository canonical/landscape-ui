import EmptyState from "@/components/layout/EmptyState";
import type { FC } from "react";
import WslProfileAddButton from "../WslProfileAddButton";

const WslProfilesEmptyState: FC = () => {
  return (
    <EmptyState
      title="No WSL profiles found"
      body={
        <>
          <p>You haven’t added any WSL profiles yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/manage-wsl-instances-in-landscape"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage WSL profiles in Landscape
          </a>
        </>
      }
      cta={[<WslProfileAddButton key="add" />]}
    />
  );
};

export default WslProfilesEmptyState;
