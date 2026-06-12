import { useState, type FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import { Icon, Tabs, Notification } from "@canonical/react-components";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { useGetMirror } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import { getSourceType } from "./helpers";
import MirrorPackagesCount from "../MirrorPackagesCount";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { boolToLabel } from "@/utils/output";
import {
  AssociatedPublicationsList,
  useGetPublicationsBySource,
} from "@/features/publications";
import classes from "./MirrorDetails.module.scss";
import MirrorPackagesList from "./components/MirrorPackagesList";
import LoadingState from "@/components/layout/LoadingState";
import {
  UBUNTU_ARCHIVE_HOST,
  UBUNTU_PRO_HOST,
  UBUNTU_SNAPSHOTS_HOST,
} from "../../constants";
import {
  getOperationStatusIcon,
  OperationStatusCell,
  useGetOperation,
  ViewLogsButton,
} from "@/features/operations";
import MirrorDetailsActionBlock from "./components/MirrorDetailsActionBlock";

const POLLING_INTERVAL = 2000;

const MirrorDetails: FC = () => {
  const { name } = usePageParams();
  const [tabId, setTabId] = useState<"details" | "packages">("details");

  const mirror = useGetMirror(name).data.data;
  const { operation, isGettingOperation } = useGetOperation(
    mirror.lastOperation ?? "",
    {
      enabled: !!mirror.lastOperation,
      refetchInterval: ({ state }) =>
        state.data?.data?.done ? false : POLLING_INTERVAL,
    },
  );
  const { publications, isGettingPublications } =
    useGetPublicationsBySource(name);

  const tabs: { label: string; id: "details" | "packages" }[] = [
    {
      label: "General details",
      id: "details",
    },
    {
      label: "Packages",
      id: "packages",
    },
  ];

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  if (mirror.lastOperation && isGettingOperation) {
    return <SidePanel.LoadingState />;
  }

  const iconName = getOperationStatusIcon(operation);

  return (
    <>
      <SidePanel.Header>{mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        {!!operation && !!operation.error && (
          <Notification
            severity="negative"
            title="Update failed"
            actions={[<ViewLogsButton resource={name} key="view-logs" />]}
          >
            Your last mirror update was not completed successfully.
          </Notification>
        )}
        <MirrorDetailsActionBlock
          displayName={mirror.displayName}
          operation={operation}
        />
        <Tabs listClassName={classes.marginBottom} links={links} />
        {tabId === "details" && (
          <Blocks>
            <Blocks.Item title="Details">
              <InfoGrid dense>
                <InfoGrid.Item label="Name" value={mirror.displayName} />
                <InfoGrid.Item
                  label="Source type"
                  value={getSourceType(mirror.archiveRoot)}
                />
                <InfoGrid.Item
                  label="Source URL"
                  value={
                    <a
                      href={mirror.archiveRoot}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mirror.archiveRoot}
                    </a>
                  }
                  large
                />
                <InfoGrid.Item
                  label="Status"
                  value={
                    <>
                      {!!iconName && (
                        <Icon name={iconName} className={classes.icon} />
                      )}
                      <OperationStatusCell operation={operation} />
                    </>
                  }
                />
                <InfoGrid.Item
                  label="Last update"
                  value={
                    mirror.lastDownloadDate &&
                    moment(mirror.lastDownloadDate).format(
                      DISPLAY_DATE_TIME_FORMAT,
                    )
                  }
                />
                <InfoGrid.Item
                  label="Packages"
                  value={
                    mirror.name && (
                      <MirrorPackagesCount mirrorName={mirror.name} />
                    )
                  }
                />
                <InfoGrid.Item
                  label="Preserve upstream signing key"
                  value={boolToLabel(mirror.preserveSignatures)}
                />
              </InfoGrid>
            </Blocks.Item>
            <Blocks.Item title="Contents">
              <InfoGrid dense>
                <InfoGrid.Item
                  label="Distribution"
                  value={mirror.distribution}
                />
                <InfoGrid.Item
                  label="Components"
                  value={mirror.components?.join(", ")}
                  large
                />
                <InfoGrid.Item
                  label="Architectures"
                  value={mirror.architectures?.join(", ")}
                  large
                />
                <InfoGrid.Item label="Filter" value={mirror.filter} large />
                {mirror.filter && (
                  <InfoGrid.Item
                    label="Include dependencies in filter"
                    value={boolToLabel(mirror.filterWithDeps)}
                    large
                  />
                )}
                <InfoGrid.Item
                  label="Download .udeb"
                  value={boolToLabel(mirror.downloadUdebs)}
                />
                <InfoGrid.Item
                  label="Download sources"
                  value={boolToLabel(mirror.downloadSources)}
                />
                <InfoGrid.Item
                  label="Download installer files"
                  value={boolToLabel(mirror.downloadInstaller)}
                />
              </InfoGrid>
            </Blocks.Item>
            {![
              UBUNTU_ARCHIVE_HOST,
              UBUNTU_SNAPSHOTS_HOST,
              UBUNTU_PRO_HOST,
            ].includes(new URL(mirror.archiveRoot).host) && (
              <Blocks.Item title="Authentication">
                <InfoGrid dense>
                  <InfoGrid.Item
                    label="Verification GPG Key"
                    value={mirror.gpgKey?.fingerprint}
                  />
                </InfoGrid>
              </Blocks.Item>
            )}
            <Blocks.Item title="Used in">
              {isGettingPublications ? (
                <LoadingState />
              ) : (
                <AssociatedPublicationsList
                  publications={publications}
                  showSources={false}
                />
              )}
            </Blocks.Item>
          </Blocks>
        )}
        {tabId === "packages" && mirror.name && (
          <MirrorPackagesList mirrorName={mirror.name} />
        )}
      </SidePanel.Content>
    </>
  );
};

export default MirrorDetails;
