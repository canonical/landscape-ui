import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LocalRepositoryPublicationsList from "../../../LocalRepositoryPublicationsList";
import LoadingState from "@/components/layout/LoadingState";
import useGetPublications from "../../../../api/useGetPublications";

interface ViewLocalRepositoryDetailsTabProps {
  readonly repository: LocalRepository;
}

const ViewLocalRepositoryDetailsTab: FC<ViewLocalRepositoryDetailsTabProps> = ({
  repository,
}) => {
  const { publications, isGettingPublications } = useGetPublications({
    filter: `source=${repository.name}`,
  });

  return (
    <Blocks>
      <Blocks.Item title="Details">
        <InfoGrid>
          <InfoGrid.Item label="Name" value={repository.display_name} />

          <InfoGrid.Item label="Description" large value={repository.comment} />

          <InfoGrid.Item
            label="Default distribution"
            value={repository.distribution}
          />

          <InfoGrid.Item
            label="Default component"
            value={repository.component}
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
