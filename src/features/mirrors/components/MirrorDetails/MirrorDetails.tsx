import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { useGetMirror, useListPublicationTargets } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import { getSourceType } from "./helpers";
import MirrorPackagesCount from "../MirrorPackagesCount";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import UpdateMirrorModal from "../UpdateMirrorModal";
import { useBoolean } from "usehooks-ts";
import RemoveMirrorModal from "../RemoveMirrorModal";
import { boolToLabel } from "@/utils/output";
import { NoPublicationTargetsModal } from "@/features/publication-targets";
import {
  AssociatedPublicationsList,
  useGetPublicationsBySource,
} from "@/features/publications";

const MirrorDetails: FC = () => {
  const { name, createSidePathPusher, sidePath, setPageParams } =
    usePageParams();

  const {
    value: isUpdateModalOpen,
    setTrue: openUpdateModal,
    setFalse: closeUpdateModal,
  } = useBoolean();
  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();
  const {
    value: isNoPublicationTargetsModalOpen,
    setTrue: openNoPublicationTargetsModal,
    setFalse: closeNoPublicationTargetsModal,
  } = useBoolean();

  const mirror = useGetMirror(name).data.data;

  const { publications } = useGetPublicationsBySource(name);

  const { publicationTargets = [] } = useListPublicationTargets({
    pageSize: 1000,
  }).data.data;

  const tryPublish = () => {
    if (publicationTargets.length || publications.length) {
      setPageParams({
        sidePath: [...sidePath, "publish"],
      });
    } else {
      openNoPublicationTargetsModal();
    }
  };

  return (
    <>
      <SidePanel.Header>{mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <div className="p-segmented-control">
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={createSidePathPusher("edit")}
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={openUpdateModal}
          >
            <Icon name="restart" />
            <span>Update</span>
          </Button>
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={tryPublish}
          >
            <Icon name="upload" />
            <span>Publish</span>
          </Button>
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={openRemoveModal}
          >
            <Icon name={`${ICONS.delete}--negative`} />
            <span className="u-text--negative">Remove</span>
          </Button>
        </div>
        <Blocks>
          <Blocks.Item title="Details" titleClassName="p-text--small-caps">
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
            </InfoGrid>
          </Blocks.Item>
          <Blocks.Item title="Contents" titleClassName="p-text--small-caps">
            <InfoGrid dense>
              <InfoGrid.Item label="Distribution" value={mirror.distribution} />
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
          <Blocks.Item title="Used in" titleClassName="p-text--small-caps">
            <AssociatedPublicationsList
              publications={publications}
              showSources={false}
            />
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <UpdateMirrorModal
        isOpen={isUpdateModalOpen}
        close={closeUpdateModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={name}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={name}
      />
      {isNoPublicationTargetsModalOpen && (
        <NoPublicationTargetsModal close={closeNoPublicationTargetsModal} />
      )}
    </>
  );
};

export default MirrorDetails;
