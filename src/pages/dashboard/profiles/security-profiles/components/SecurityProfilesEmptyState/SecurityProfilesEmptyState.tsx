import type { FC } from "react";
import { Suspense } from "react";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const SecurityProfilesEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreateSecurityProfile = () => {
    setSidePanelContent(
      "Add security profile",
      <Suspense fallback={<LoadingState />} />,
      "medium",
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p>You haven’t added any security profiles yet.</p>
        </>
      }
      cta={[
        <Button
          type="button"
          key="add"
          appearance="positive"
          onClick={handleCreateSecurityProfile}
        >
          Add a security profile
        </Button>,
      ]}
      title="No security profiles found"
    />
  );
};

export default SecurityProfilesEmptyState;
