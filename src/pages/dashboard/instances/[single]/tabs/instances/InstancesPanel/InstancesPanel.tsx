import { FC } from "react";
import { Instance } from "@/types/Instance";
import InstancesTable from "@/pages/dashboard/instances/[single]/tabs/instances/InstancesTable";
import EmptyState from "@/components/layout/EmptyState";
import { Button, Link } from "@canonical/react-components";
import InstallWslInstanceForm from "@/pages/dashboard/instances/[single]/tabs/instances/InstallWslInstanceForm";
import useSidePanel from "@/hooks/useSidePanel";

interface InstancesPanelProps {
  instance: Instance;
}

const InstancesPanel: FC<InstancesPanelProps> = ({ instance }) => {
  const { setSidePanelContent } = useSidePanel();

  return instance.children.length === 0 ? (
    <EmptyState
      title="No WSL Instances found"
      body={
        <>
          <p>
            This computer does not have any WSL instances installed. You can
            install a new instance by clicking the button below.
          </p>
          <Link
            href="https://ubuntu.com/desktop/wsl"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn more about Ubuntu WSL
            <i className="p-icon--external-link" />
          </Link>
        </>
      }
      cta={[
        <Button
          key="install-new-instance-button"
          appearance="positive"
          type="button"
          onClick={() => {
            setSidePanelContent(
              "Install new WSL instance",
              <InstallWslInstanceForm />,
            );
          }}
        >
          <span>Install new WSL instance</span>
        </Button>,
      ]}
    />
  ) : (
    <InstancesTable instance={instance} />
  );
};

export default InstancesPanel;
