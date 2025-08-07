import EmptyState from "@/components/layout/EmptyState";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";

const PackageProfilesEmptyState: FC = () => {
  const { setPageParams } = usePageParams();

  return (
    <EmptyState
      body={
        <>
          <p>You haven’t added any package profiles yet.</p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-packages"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage packages in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          type="button"
          key="add"
          appearance="positive"
          onClick={() => {
            setPageParams({ action: "add" });
          }}
        >
          Add package profile
        </Button>,
      ]}
      title="No package profiles found"
    />
  );
};

export default PackageProfilesEmptyState;
