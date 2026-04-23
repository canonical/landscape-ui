import type { FC } from "react";
import SidePanel from "@/components/layout/SidePanel/SidePanel";
import { Button, Icon, ICONS } from "@canonical/react-components";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { useGetMirror, useListPublications } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import { getSourceType } from "./helpers";
import MirrorPackagesCount from "../MirrorPackagesCount";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import MirrorPublicationsList from "../MirrorPublicationsList";
import UpdateMirrorModal from "../UpdateMirrorModal";
import { useBoolean } from "usehooks-ts";
import RemoveMirrorModal from "../RemoveMirrorModal";

const MirrorDetails: FC = () => {
  const { name, createSidePathPusher } = usePageParams();
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

  const decodedName = decodeURIComponent(name);

  const mirror = useGetMirror(decodedName).data.data;

  const { publications = [] } = useListPublications({
    filter: `source="${name}"`,
    pageSize: 1000,
  }).data.data;

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
            onClick={createSidePathPusher("publish")}
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
                label="Last update"
                value={moment(mirror.lastDownloadDate).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
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
          <Blocks.Item title="Contents">
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
                value={mirror.downloadUdebs ? "Yes" : "No"}
              />
              <InfoGrid.Item
                label="Download sources"
                value={mirror.downloadSources ? "Yes" : "No"}
              />
              <InfoGrid.Item
                label="Download installer files"
                value={mirror.downloadInstaller ? "Yes" : "No"}
              />
            </InfoGrid>
          </Blocks.Item>
          <Blocks.Item title="Used in">
            <MirrorPublicationsList publications={publications} />
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <UpdateMirrorModal
        isOpen={isUpdateModalOpen}
        close={closeUpdateModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={decodedName}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={decodedName}
      />
    </>
  );
};

export default MirrorDetails;
