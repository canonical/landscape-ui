import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import type { PublicationTargetWithPublications } from "../../types";
import PublicationsTable from "../PublicationsTable/PublicationsTable";

const EditTargetForm = lazy(async () => import("../EditTargetForm/EditTargetForm"));
const RemoveTargetForm = lazy(async () => import("../RemoveTargetForm/RemoveTargetForm"));

interface TargetDetailsProps {
  readonly target: PublicationTargetWithPublications;
}

const TargetDetails: FC<TargetDetailsProps> = ({ target }) => {
  const { setSidePanelContent } = useSidePanel();

  const handleEditTarget = (): void => {
    setSidePanelContent(
      `Edit "${target.displayName ?? target.name}"`,      <Suspense fallback={<LoadingState />}>
        <EditTargetForm target={target} />
      </Suspense>,
    );
  };

  const handleRemoveTarget = (): void => {
    setSidePanelContent(
      `Remove ${target.displayName}`,      <Suspense fallback={<LoadingState />}>
        <RemoveTargetForm target={target} />
      </Suspense>,
    );
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
      <div className="p-segmented-control u-no-margin--bottom">
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
          appearance="negative"
          className="p-segmented-control__button"
          hasIcon
          onClick={handleRemoveTarget}
        >
          <Icon light={true} name="delete" />
          <span>Remove</span>
        </Button>
      </div>

      
      <InfoGrid spaced>
        <h5>DETAILS</h5>
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

      {target.publications.length > 0 && (
        <>
          <h5>USED IN</h5>
          <PublicationsTable publications={target.publications} />
        </>
      )}
    </>
  );
};

export default TargetDetails;

