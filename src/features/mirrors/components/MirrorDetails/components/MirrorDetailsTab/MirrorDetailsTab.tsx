import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { Mirror } from "@canonical/landscape-openapi";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import date from "@/libs/date";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { boolToLabel } from "@/utils/output";
import {
  AssociatedPublicationsList,
  useGetPublicationsBySource,
} from "@/features/publications";
import { OperationStatusContent, type Operation } from "@/features/operations";
import { getSourceType, shouldShowAuthentication } from "../../helpers";
import MirrorPackagesCount from "../../../MirrorPackagesCount";

interface MirrorDetailsTabProps {
  readonly mirror: Mirror;
  readonly operation?: Operation;
}

const MirrorDetailsTab: FC<MirrorDetailsTabProps> = ({ mirror, operation }) => {
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    mirror.name,
  );

  return (
    <Blocks>
      <Blocks.Item
        title="Details"
        notification={
          mirror.preserveSignatures && (
            <Notification severity="information">
              Signature-preserving mirrors do not support independent syncs -
              they sync during publication
            </Notification>
          )
        }
      >
        <InfoGrid dense>
          <InfoGrid.Item label="Name" value={mirror.displayName} />
          <InfoGrid.Item label="Source type" value={getSourceType(mirror)} />
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
              <OperationStatusContent
                operationMetadata={operation?.metadata}
                type="mirror"
                hasOperation={!!mirror.lastOperation}
              />
            }
          />
          <InfoGrid.Item
            label="Last update"
            value={
              mirror.lastDownloadDate &&
              date(mirror.lastDownloadDate).format(DISPLAY_DATE_TIME_FORMAT)
            }
          />
          <InfoGrid.Item
            label="Preserve upstream signing key"
            value={boolToLabel(mirror.preserveSignatures)}
          />
          <InfoGrid.Item
            label="Packages"
            value={
              mirror.name && <MirrorPackagesCount mirrorName={mirror.name} />
            }
          />
        </InfoGrid>
      </Blocks.Item>
      <Blocks.Item title="Contents">
        <InfoGrid dense>
          <InfoGrid.Item label="Distribution" value={mirror.distribution} />
          <InfoGrid.Item
            label="Components"
            value={mirror.components.join(", ")}
            large
          />
          <InfoGrid.Item
            label="Architectures"
            value={mirror.architectures.join(", ")}
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
      {shouldShowAuthentication(mirror) && (
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
  );
};

export default MirrorDetailsTab;
