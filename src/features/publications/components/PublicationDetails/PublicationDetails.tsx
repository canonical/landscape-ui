import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { boolToLabel } from "@/utils/output";
import { Button, Icon, ICONS } from "@canonical/react-components";
import moment from "moment";
import { useBoolean } from "usehooks-ts";
import type { Publication } from "../../types";
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
            aria-label={`Republish ${publication.name}`}
          >
            <Icon name="upload" />
            <span>Republish</span>
          </Button>

          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={openRemoveModal}
            hasIcon
            aria-label={`Remove ${publication.name}`}
          >
            <Icon name={`${ICONS.delete}--negative`} />
            <span className="u-text--negative">Remove</span>
          </Button>
        </div>
      </div>

      <Blocks>
        <Blocks.Item title="Details" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item label="Name" value={publication.name} />

            <InfoGrid.Item
              label="Source type"
              value={publication.source_type}
            />

            <InfoGrid.Item label="Source" large value={publication.source} />

            <InfoGrid.Item
              label="Publication target"
              large
              value={publication.publication_target}
            />

            <InfoGrid.Item
              label="Date published"
              value={`${moment(publication.date_published).format(DISPLAY_DATE_TIME_FORMAT)} UTC`}
            />

            <InfoGrid.Item label="Prefix" value={publication.prefix} />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Uploaders" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item
              label="Distribution"
              value={publication.uploaders.distribution}
            />

            <InfoGrid.Item
              label="Components"
              large
              value={publication.uploaders.components.join(", ")}
            />

            <InfoGrid.Item
              label="Architectures"
              large
              value={publication.uploaders.architectures.join(", ")}
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="Settings" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item
              label="Hash indexing"
              value={boolToLabel(publication.settings.hash_indexing)}
            />

            <InfoGrid.Item
              label="Automatic installation"
              value={boolToLabel(publication.settings.automatic_installation)}
            />

            <InfoGrid.Item
              label="Automatic upgrades"
              value={boolToLabel(publication.settings.automatic_upgrades)}
            />

            <InfoGrid.Item
              label="Skip bz2"
              value={boolToLabel(publication.settings.skip_bz2)}
            />

            <InfoGrid.Item
              label="Skip content indexing"
              value={boolToLabel(publication.settings.skip_content_indexing)}
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
