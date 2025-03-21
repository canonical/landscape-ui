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
      "Add a security profile",
      <Suspense fallback={<LoadingState />} />,
      "medium",
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p>
            Add a security profile to ensure security and complaince across your
            instances. Security profile audits aggregate audit results over time
            and in bulk, helping you align with tailored security benchmarks,
            run scheduled audits, and generate detailed audits for your estate.
          </p>
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
