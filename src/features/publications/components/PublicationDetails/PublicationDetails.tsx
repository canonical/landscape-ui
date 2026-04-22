import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { boolToLabel } from "@/utils/output";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { useBoolean } from "usehooks-ts";
import type { Publication } from "../../types";
import { getPublicationTargetName, getSourceName } from "../../helpers";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";

interface PublicationDetailsProps {
  readonly publication: Publication;
}

const PublicationDetails = ({ publication }: PublicationDetailsProps) => {
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

  return (
    <>
      <div
        className="p-segmented-control"
        style={{
          marginBottom: "1.5rem",
        }}
      >
        <div className="p-segmented-control__list">
          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={openRepublishModal}
            hasIcon
            aria-label={`Republish ${publication.label}`}
          >
            <Icon name="upload" />
            <span>Republish</span>
          </Button>

          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={openRemoveModal}
            hasIcon
            aria-label={`Remove ${publication.label}`}
          >
            <Icon name={`${ICONS.delete}--negative`} />
            <span className="u-text--negative">Remove</span>
          </Button>
        </div>
      </div>

      <Blocks>
        <Blocks.Item title="Details" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item label="Name" value={publication.label} />

            <InfoGrid.Item
              label="Source"
              large
              value={getSourceName(publication.source)}
            />

            <InfoGrid.Item
              label="Publication target"
              large
              value={getPublicationTargetName(publication.publicationTarget)}
            />

            <InfoGrid.Item
              label="Distribution"
              value={publication.distribution}
            />

            <InfoGrid.Item label="Label" value={publication.label} />

            <InfoGrid.Item label="Origin" value={publication.origin} />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Uploaders" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item
              label="Architectures"
              large
              value={publication.architectures.join(", ")}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Settings" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item
              label="Hash indexing"
              value={boolToLabel(Boolean(publication.acquireByHash))}
            />

            <InfoGrid.Item
              label="Automatic installation"
              value={boolToLabel(!publication.notAutomatic)}
            />

            <InfoGrid.Item
              label="Automatic upgrades"
              value={boolToLabel(Boolean(publication.butAutomaticUpgrades))}
            />

            <InfoGrid.Item
              label="Multi dist"
              value={boolToLabel(Boolean(publication.multiDist))}
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
