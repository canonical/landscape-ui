import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import usePageParams from "@/hooks/usePageParams";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useBoolean } from "usehooks-ts";
import RemoveTargetForm from "../RemoveTargetForm";
import Blocks from "@/components/layout/Blocks/Blocks";
import {
  getTargetType,
  TARGET_TYPE_LABELS,
} from "../EditTargetForm/EditTargetForm";
import { AssociatedPublicationsList } from "@/features/publications";
import type { PublicationTarget } from "@canonical/landscape-openapi";
import { useBatchGetMirrors } from "@/features/mirrors";
import { useBatchGetLocals } from "@/features/local-repositories";
import { LINK_METHOD_OPTIONS } from "../../constants";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

interface TargetDetailsProps {
  readonly target: PublicationTarget;
}

const TargetDetails: FC<TargetDetailsProps> = ({ target }) => {
  const { createSidePathPusher } = usePageParams();
  const { publications, isGettingPublications } = useGetPublicationsByTarget(
    target.publicationTargetId,
  );

  const mirrorNames = useMemo(
    () => [
      ...new Set(
        publications
          .map((p) => p.source)
          .filter((s) => s.startsWith("mirrors/")),
      ),
    ],
    [publications],
  );

  const localNames = useMemo(
    () => [
      ...new Set(
        publications
          .map((p) => p.source)
          .filter((s) => s.startsWith("locals/")),
      ),
    ],
    [publications],
  );

  const { mirrorDisplayNames, isLoadingMirrorDisplayNames } =
    useBatchGetMirrors(mirrorNames);
  const { localDisplayNames, isLoadingLocalDisplayNames } =
    useBatchGetLocals(localNames);

  const sourceDisplayNames = useMemo(
    () => ({ ...mirrorDisplayNames, ...localDisplayNames }),
    [mirrorDisplayNames, localDisplayNames],
  );

  const isLoadingDisplayNames =
    isLoadingMirrorDisplayNames || isLoadingLocalDisplayNames;

  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  const handleEditTarget = createSidePathPusher("edit");

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

  const swiftFields = target.swift
    ? {
        container: target.swift.container,
        authUrl: target.swift.authUrl,
        prefix: target.swift.prefix,
        tenant: target.swift.tenant,
        tenantId: target.swift.tenantId,
        domain: target.swift.domain,
        domainId: target.swift.domainId,
        tenantDomain: target.swift.tenantDomain,
        tenantDomainId: target.swift.tenantDomainId,
      }
    : null;

  const filesystemFields = target.filesystem
    ? {
        path: target.filesystem.path,
        linkMethod: target.filesystem.linkMethod,
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
        <Blocks.Item title="General" titleClassName="p-text--small-caps">
          <InfoGrid dense>
            <InfoGrid.Item label="Name" value={target.displayName} />
            <InfoGrid.Item
              label="Type"
              value={TARGET_TYPE_LABELS[getTargetType(target)]}
            />
          </InfoGrid>
        </Blocks.Item>
        <Blocks.Item title="Details" titleClassName="p-text--small-caps">
          <InfoGrid dense>
            {s3Fields && (
              <>
                <InfoGrid.Item label="Region" value={s3Fields.region} />
                <InfoGrid.Item label="Bucket Name" value={s3Fields.bucket} />
                <InfoGrid.Item label="Prefix" value={s3Fields.prefix} />
                <InfoGrid.Item label="ACL" value={s3Fields.acl} />
                <InfoGrid.Item
                  label="Storage class"
                  value={s3Fields.storageClass}
                />
                <InfoGrid.Item
                  label="Encryption method"
                  value={s3Fields.encryptionMethod}
                />
                <InfoGrid.Item
                  label="Disable MultiDel"
                  value={s3Fields.disableMultiDel}
                />
                <InfoGrid.Item
                  label="Force AWS SIGv2"
                  value={s3Fields.forceSigV2}
                />
              </>
            )}

            {swiftFields && (
              <>
                <InfoGrid.Item
                  label="Auth URL"
                  large
                  value={swiftFields.authUrl}
                />
                <InfoGrid.Item
                  label="Container"
                  value={swiftFields.container}
                />
                <InfoGrid.Item label="Prefix" value={swiftFields.prefix} />
                <InfoGrid.Item label="Tenant" value={swiftFields.tenant} />
                <InfoGrid.Item label="Tenant ID" value={swiftFields.tenantId} />
                <InfoGrid.Item label="Domain" value={swiftFields.domain} />
                <InfoGrid.Item label="Domain ID" value={swiftFields.domainId} />
                <InfoGrid.Item
                  label="Tenant domain"
                  value={swiftFields.tenantDomain}
                />
                <InfoGrid.Item
                  label="Tenant domain ID"
                  value={swiftFields.tenantDomainId}
                />
              </>
            )}

            {filesystemFields && (
              <>
                <InfoGrid.Item
                  label="Path"
                  large
                  value={filesystemFields.path}
                />
                <InfoGrid.Item
                  label="Link method"
                  value={
                    LINK_METHOD_OPTIONS.find(
                      (o) => o.value === filesystemFields.linkMethod,
                    )?.label ?? NO_DATA_TEXT
                  }
                />
              </>
            )}
          </InfoGrid>
        </Blocks.Item>

        {!isGettingPublications && publications.length > 0 && (
          <Blocks.Item title="Used In" titleClassName="p-text--small-caps">
            <AssociatedPublicationsList
              publications={publications}
              sourceDisplayNames={
                isLoadingDisplayNames ? undefined : sourceDisplayNames
              }
            />
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
