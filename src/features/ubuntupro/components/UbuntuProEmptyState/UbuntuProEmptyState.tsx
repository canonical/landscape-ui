import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import type { FC } from "react";

interface UbuntuProEmptyStateProps {
  readonly instance: Instance;
}

const UbuntuProEmptyState: FC<UbuntuProEmptyStateProps> = ({ instance: _instance }) => {
  const { createSidePathPusher } = usePageParams();

  const handleAttachToken = createSidePathPusher("attach-token");
  return (
    <EmptyState
      title="No Ubuntu Pro entitlement"
      body={
        <>
          <p>
            This computer is not currently attached to an Ubuntu Pro
            entitlement, which provides additional security updates and other
            benefits from Canonical.
          </p>
          <a
            href="https://ubuntu.com/pro"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn more about Ubuntu Pro
          </a>
        </>
      }
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
