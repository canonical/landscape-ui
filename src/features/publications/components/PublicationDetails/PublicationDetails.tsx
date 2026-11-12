import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { boolToLabel } from "@/utils/output";
import type { Publication } from "@canonical/landscape-openapi";
import { Tooltip } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import { useBoolean } from "usehooks-ts";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";
import { getInstallsAndUpgradesText, getSourceType } from "../../helpers";
import {
  DISPLAY_DATE_TIME_FORMAT,
  DEFAULT_POLLING_INTERVAL,
} from "@/constants";
import date from "@/libs/date";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";
import {
  OperationStatusContent,
  useGetOperation,
  OperationStatusNotification,
  useCanCancelOperations,
} from "@/features/operations";
import LoadingState from "@/components/layout/LoadingState";
import MissingSourceLabel from "../MissingSourceLabel";

interface PublicationDetailsProps {
  readonly publication: Publication;
  readonly sourceDisplayName: string;
  readonly publicationTargetDisplayName: string;
  readonly isSourceNotFound?: boolean;
}

const PublicationDetails = ({
  publication,
  sourceDisplayName,
  publicationTargetDisplayName,
  isSourceNotFound = false,
}: PublicationDetailsProps) => {
  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const {
    value: isRepublishModalOpen,
    setTrue: openRepublishModal,
    setFalse: closeRepublishModal,
  } = useBoolean();

  const { operation, isGettingOperation } = useGetOperation(
    publication.lastOperation ?? "",
    {
      refetchInterval: ({ state }) =>
        state.error || state.data?.data?.done
          ? false
          : DEFAULT_POLLING_INTERVAL,
    },
  );

  const canCancelOperations = useCanCancelOperations();
  const isPublishing = !!operation && !operation.done;

  if (publication.lastOperation && isGettingOperation) {
    return <LoadingState />;
  }

  return (
    <>
      <OperationStatusNotification operation={operation} type="publishing" />
      <div className="p-segmented-control u-sv2">
        <div className="p-segmented-control__list">
          {!canCancelOperations && isPublishing ? (
            <Tooltip
              message="You must wait for this action to be completed to republish it."
              position="btm-center"
            >
              <Button
                type="button"
                importance="secondary"
                className="p-segmented-control__button"
                loading
                disabled
              >
                Publishing
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="button"
              importance="secondary"
              icon="upload"
              className="p-segmented-control__button"
              onClick={openRepublishModal}
            >
              Republish
            </Button>
          )}
          <Button
            type="button"
            importance="secondary"
            anticipation="destructive"
            icon="delete"
            className="p-segmented-control__button"
            onClick={openRemoveModal}
          >
            Remove
          </Button>
        </div>
      </div>

      <Blocks>
        <Blocks.Item title="Details">
          <InfoGrid dense>
            <InfoGrid.Item label="Name" value={publication.displayName} />
            <InfoGrid.Item
              label="Publication target"
              value={publicationTargetDisplayName}
            />

            <InfoGrid.Item
              label="Source type"
              value={getSourceType(publication.source)}
            />
            <InfoGrid.Item
              label="Source"
              value={
                isSourceNotFound ? <MissingSourceLabel /> : sourceDisplayName
              }
            />

            <InfoGrid.Item
              label="Status"
              value={
                <OperationStatusContent
                  operationMetadata={operation?.metadata}
                  type="publication"
                  hasOperation={!!publication.lastOperation}
                />
              }
            />
            <InfoGrid.Item
              label="Last published"
              value={
                publication.publishTime
                  ? date(publication.publishTime).format(
                      DISPLAY_DATE_TIME_FORMAT,
                    )
                  : NO_DATA_TEXT
              }
            />

            {publication.gpgKey && (
              <InfoGrid.Item
                label="Signing GPG Key"
                value={publication.gpgKey.fingerprint}
              />
            )}
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Contents">
          <InfoGrid dense>
            {publication.distribution && (
              <InfoGrid.Item
                label="Distribution"
                large
                value={publication.distribution}
              />
            )}

            <InfoGrid.Item
              label="Architectures"
              large
              value={publication.architectures?.join(", ")}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Settings">
          <InfoGrid dense>
            <InfoGrid.Item
              label="Installs and upgrades"
              value={getInstallsAndUpgradesText(publication)}
            />

            <InfoGrid.Item
              label="Hash indexing"
              value={boolToLabel(Boolean(publication.acquireByHash))}
            />

            <InfoGrid.Item
              label="Skip bz2"
              value={boolToLabel(Boolean(publication.skipBz2))}
            />

            <InfoGrid.Item
              label="Skip content indexing"
              value={boolToLabel(Boolean(publication.skipContents))}
            />
          </InfoGrid>
        </Blocks.Item>
      </Blocks>

      <RepublishPublicationModal
        isOpen={isRepublishModalOpen}
        isPublishing={isPublishing}
        close={closeRepublishModal}
        publication={publication}
      />

      <RemovePublicationModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        publication={publication}
      />
    </>
  );
};

export default PublicationDetails;
