import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { useBoolean } from "usehooks-ts";
import type { PublicationTarget } from "../../types";
import PublicationsTable from "../PublicationsTable/PublicationsTable";
import RemoveTargetForm from "../RemoveTargetForm";
import Blocks from "@/components/layout/Blocks/Blocks";

interface TargetDetailsProps {
  readonly target: PublicationTarget;
}

const TargetDetails: FC<TargetDetailsProps> = ({ target }) => {
  const { createPageParamsSetter } = usePageParams();
  const { publications, isGettingPublications } = useGetPublicationsByTarget(
    target.publicationTargetId,
  );
  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleEditTarget = createPageParamsSetter({ sidePath: ["edit"] });

  const handleRemoveTarget = (): void => {
    openRemoveModal();
  };

  const s3Fields = target.s3
    ? {
        region: target.s3.region,
        bucket: target.s3.bucket,
        endpoint: target.s3.endpoint,
        prefix: target.s3.prefix,
        acl: target.s3.acl,
        storageClass: target.s3.storageClass,
        encryptionMethod: target.s3.encryptionMethod,
        disableMultiDel: target.s3.disableMultiDel ? "Yes" : "No",
        forceSigV2: target.s3.forceSigV2 ? "Yes" : "No",
      }
    : null;

  return (
    <>
      <div className="p-segmented-control u-sv2">
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={handleEditTarget}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          className="p-segmented-control__button"
          hasIcon
          onClick={handleRemoveTarget}
        >
          <Icon name={`${ICONS.delete}--negative`} />
          <span className="u-text--negative">Remove</span>
        </Button>
      </div>
      <Blocks dense>
        <Blocks.Item title="Details">
        <InfoGrid dense>
            <InfoGrid.Item label="Name" large value={target.displayName} />

            {s3Fields && (
              <>
                <InfoGrid.Item label="Region" value={s3Fields.region} />
                <InfoGrid.Item label="Bucket Name" value={s3Fields.bucket} />
                <InfoGrid.Item label="Prefix" value={s3Fields.prefix} />
                <InfoGrid.Item label="ACL" value={s3Fields.acl} />
                <InfoGrid.Item label="Storage class" value={s3Fields.storageClass} />
                <InfoGrid.Item label="Encryption method" value={s3Fields.encryptionMethod} />
                <InfoGrid.Item label="Disable MultiDel" value={s3Fields.disableMultiDel} />
                <InfoGrid.Item label="Force AWS SIGv2" value={s3Fields.forceSigV2} />
              </>
            )}

          </InfoGrid>
        </Blocks.Item>

        {!isGettingPublications && publications.length > 0 && (
          <Blocks.Item title="Used In">
            <PublicationsTable publications={publications} />
          </Blocks.Item>
        )}
      </Blocks>

      {isGettingPublications && <LoadingState />}

      {createPortal(
        <RemoveTargetForm
          isOpen={isRemoveModalOpen}
          close={closeRemoveModal}
          target={target}
        />,
        document.body,
      )}
    </>
  );
};

export default TargetDetails;

