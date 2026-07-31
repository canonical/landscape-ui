import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import useGetPublicationTarget from "../../api/useGetPublicationTarget";
import usePageParams from "@/hooks/usePageParams";
import SidePanel from "@/components/layout/SidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import { useBoolean } from "usehooks-ts";
import RemoveTargetModal from "../RemoveTargetModal";
import Blocks from "@/components/layout/Blocks/Blocks";
import {
  getTargetType,
  TARGET_TYPE_LABELS,
} from "../EditTargetForm/EditTargetForm";
import { AssociatedPublicationsList } from "@/features/publications";
import { useBatchGetMirrors } from "@/features/mirrors";
import { useBatchGetLocals } from "@/features/local-repositories";
import { LINK_METHOD_OPTIONS } from "../../constants";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

const TargetDetails: FC = () => {
  const { createSidePathPusher, name } = usePageParams();
  const { publicationTarget, isGettingPublicationTarget } =
    useGetPublicationTarget(name);

  const { publications, isGettingPublications } = useGetPublicationsByTarget(
    publicationTarget?.publicationTargetId,
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

  if (isGettingPublicationTarget) {
    return <SidePanel.LoadingState />;
  }
  if (!name) {
    return null;
  }
  if (!publicationTarget) {
    throw new Error(`Publication target ${name} was not found`);
  }

  const { s3, swift, filesystem } = publicationTarget;

  const s3Fields = s3
    ? {
        region: s3.region,
        bucket: s3.bucket,
        endpoint: s3.endpoint,
        prefix: s3.prefix,
        acl: s3.acl,
        storageClass: s3.storageClass,
        encryptionMethod: s3.encryptionMethod,
        disableMultiDel: s3.disableMultiDel ? "Yes" : "No",
        forceSigV2: s3.forceSigV2 ? "Yes" : "No",
      }
    : null;

  const swiftFields = swift
    ? {
        container: swift.container,
        authUrl: swift.authUrl,
        prefix: swift.prefix,
        tenant: swift.tenant,
        tenantId: swift.tenantId,
        domain: swift.domain,
        domainId: swift.domainId,
        tenantDomain: swift.tenantDomain,
        tenantDomainId: swift.tenantDomainId,
      }
    : null;

  const filesystemFields = filesystem
    ? {
        path: filesystem.path,
        linkMethod: filesystem.linkMethod,
      }
    : null;

  return (
    <>
      <SidePanel.Header>{publicationTarget.displayName}</SidePanel.Header>
      <SidePanel.Content>
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
        <Blocks>
          <Blocks.Item title="General">
            <InfoGrid dense>
              <InfoGrid.Item
                label="Name"
                value={publicationTarget.displayName}
              />
              <InfoGrid.Item
                label="Type"
                value={TARGET_TYPE_LABELS[getTargetType(publicationTarget)]}
              />
            </InfoGrid>
          </Blocks.Item>
          <Blocks.Item title="Details">
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
                  <InfoGrid.Item
                    label="Tenant ID"
                    value={swiftFields.tenantId}
                  />
                  <InfoGrid.Item label="Domain" value={swiftFields.domain} />
                  <InfoGrid.Item
                    label="Domain ID"
                    value={swiftFields.domainId}
                  />
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

          <Blocks.Item title="Used In">
            {isGettingPublications ? (
              <LoadingState />
            ) : (
              <AssociatedPublicationsList
                publications={publications}
                sourceDisplayNames={
                  isLoadingDisplayNames ? undefined : sourceDisplayNames
                }
              />
            )}
          </Blocks.Item>
        </Blocks>

        <RemoveTargetModal
          isOpen={isRemoveModalOpen}
          close={closeRemoveModal}
          target={publicationTarget}
        />
      </SidePanel.Content>
    </>
  );
};

export default TargetDetails;
