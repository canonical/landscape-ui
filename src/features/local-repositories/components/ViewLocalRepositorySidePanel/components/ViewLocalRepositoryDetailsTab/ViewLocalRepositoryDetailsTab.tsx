import type { FC } from "react";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LocalRepositoryPublicationsList from "../../../LocalRepositoryPublicationsList";
import LoadingState from "@/components/layout/LoadingState";
import useGetPublicationsBySource from "../../../../api/useGetPublicationsBySource";
import type { Local } from "@canonical/landscape-openapi";

interface ViewLocalRepositoryDetailsTabProps {
  readonly repository: Local;
}

const ViewLocalRepositoryDetailsTab: FC<ViewLocalRepositoryDetailsTabProps> = ({
  repository,
}) => {
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    repository.name,
  );

  return (
    <Blocks>
      <Blocks.Item title="Details">
        <InfoGrid>
          <InfoGrid.Item label="Name" value={repository.displayName} />

          <InfoGrid.Item label="Description" large value={repository.comment} />

          <InfoGrid.Item
            label="Default distribution"
            value={repository.defaultDistribution}
          />

          <InfoGrid.Item
            label="Default component"
            value={repository.defaultComponent}
          />
        </InfoGrid>
      </Blocks.Item>

      <Blocks.Item title="Used in">
        {isGettingPublications ? (
          <LoadingState />
        ) : (
          <LocalRepositoryPublicationsList publications={publications} />
        )}
      </Blocks.Item>
    </Blocks>
  );
};

export default ViewLocalRepositoryDetailsTab;
