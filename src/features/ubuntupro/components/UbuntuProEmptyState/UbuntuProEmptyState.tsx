import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { Button } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance } from "@/types/Instance";
import { lazy, Suspense, type FC } from "react";

const AttachTokenForm = lazy(async () => import("../AttachTokenForm"));

interface UbuntuProEmptyStateProps {
  readonly instance: Instance;
}

const UbuntuProEmptyState: FC<UbuntuProEmptyStateProps> = ({ instance }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleAttachToken = () => {
    setSidePanelContent(
      "Attach Ubuntu Pro token",
      <Suspense fallback={<LoadingState />}>
        <AttachTokenForm selectedInstances={[instance]} />
      </Suspense>,
    );
  };
  return (
    <EmptyState
      title="No Ubuntu Pro entitlement"
      body="This computer is not currently attached to an Ubuntu Pro entitlement, which provides additional security updates and other benefits from Canonical."
      link={{
        href: "https://ubuntu.com/pro",
        text: "Learn more about Ubuntu Pro",
      }}
      cta={[
        <Button
          key="attach-ubuntu-pro"
          appearance="positive"
          type="button"
          onClick={handleAttachToken}
        >
          Attach Ubuntu Pro
        </Button>,
      ]}
    />
  );
};

export default UbuntuProEmptyState;
