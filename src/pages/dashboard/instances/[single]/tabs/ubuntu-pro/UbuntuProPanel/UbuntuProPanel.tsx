import { FC } from "react";
import { Instance } from "@/types/Instance";
import { UbuntuProHeader, UbuntuProList } from "@/features/ubuntupro";
import EmptyState from "@/components/layout/EmptyState";
import { Button, Link } from "@canonical/react-components";
import classes from "./UbuntuProPanel.module.scss";

interface UbuntuProPanelProps {
  instance: Instance;
}

const UbuntuProPanel: FC<UbuntuProPanelProps> = ({ instance }) => {
  return instance.ubuntu_pro_info ? (
    <>
      <UbuntuProHeader ubuntuProData={instance.ubuntu_pro_info} />
      <UbuntuProList services={instance.ubuntu_pro_info.services} />
    </>
  ) : (
    <EmptyState
      title="No Ubuntu Pro entitlement"
      body={
        <>
          <p>
            This computer is not currently attached to an Ubuntu Pro
            entitlement, which provides additional security updates and other
            benefits from Canonical
          </p>
          <Link
            href="https://ubuntu.com/pro"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Learn more about Ubuntu Pro
            <i className="p-icon--external-link" />
          </Link>
        </>
      }
      cta={[
        <Link
          key="attach-ubuntu-pro"
          href="http://ubuntu.com/pro/dashboard"
          target="_blank"
          rel="nofollow noopener noreferrer"
          className={classes.attachUbuntuProButton}
        >
          <Button appearance="positive" type="button" aria-label="Go back">
            Attach Ubuntu Pro
          </Button>
        </Link>,
      ]}
    />
  );
};

export default UbuntuProPanel;
