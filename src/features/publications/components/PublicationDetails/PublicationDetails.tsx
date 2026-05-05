import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import { boolToLabel } from "@/utils/output";
import type { Publication } from "@canonical/landscape-openapi";
import { Button, Icon, ICONS } from "@canonical/react-components";
import { useBoolean } from "usehooks-ts";
import RemovePublicationModal from "../RemovePublicationModal";
import RepublishPublicationModal from "../RepublishPublicationModal";
import { getSourceType } from "../../helpers";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import usePageParams from "@/hooks/usePageParams/usePageParams";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

interface PublicationDetailsProps {
  readonly publication: Publication;
  readonly sourceDisplayName?: string;
  readonly publicationTargetDisplayName?: string;
}

const PublicationDetails = ({
  publication,
  sourceDisplayName,
  publicationTargetDisplayName,
}: PublicationDetailsProps) => {
  const { createPageParamsSetter } = usePageParams();
  const closePanel = createPageParamsSetter({ sidePath: [], name: "" });

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
            aria-label={`Republish ${publication.displayName}`}
          >
            <Icon name="upload" />
            <span>Republish</span>
          </Button>

          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={openRemoveModal}
            hasIcon
            aria-label={`Remove ${publication.displayName}`}
          >
            <Icon name={`${ICONS.delete}--negative`} />
            <span className="u-text--negative">Remove</span>
          </Button>
        </div>
      </div>

      <Blocks>
        <Blocks.Item title="Details" titleClassName="p-text--small-caps">
          <InfoGrid dense>
            <InfoGrid.Item label="Name" large value={publication.displayName} />

            <InfoGrid.Item
              label="Source type"
              value={getSourceType(publication.source)}
            />

            <InfoGrid.Item label="Source" value={sourceDisplayName} />

            <InfoGrid.Item
              label="Publication target"
              value={publicationTargetDisplayName}
            />

            <InfoGrid.Item
              label="Date published"
              value={
                publication.publishTime
                  ? moment(publication.publishTime).format(
                      DISPLAY_DATE_TIME_FORMAT,
                    )
                  : NO_DATA_TEXT
              }
            />
          </InfoGrid>
        </Blocks.Item>

        <Blocks.Item title="contents" titleClassName="p-text--small-caps">
          <InfoGrid>
            <InfoGrid.Item
              label="Architectures"
              large
              value={publication.architectures?.join(", ")}
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
        close={() => {
          closeRepublishModal();
          closePanel();
        }}
        publication={publication}
      />

      <RemovePublicationModal
        isOpen={isRemoveModalOpen}
        close={() => {
          closeRemoveModal();
          closePanel();
        }}
        publication={publication}
      />
    </>
  );
};

export default PublicationDetails;
