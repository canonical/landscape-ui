import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LocalRepositoryPublicationsList from "../../../LocalRepositoryPublicationsList";

interface ViewLocalRepositoryDetailsTabProps {
  readonly repository: LocalRepository;
}

const ViewLocalRepositoryDetailsTab: FC<ViewLocalRepositoryDetailsTabProps> = ({
  repository,
}) => {
  return (
    <Blocks>
      <Blocks.Item title="Details">
        <InfoGrid>
          <InfoGrid.Item label="Name" value={repository.name} />

          <InfoGrid.Item
            label="Description"
            large
            value={repository.comment}
          />

          <InfoGrid.Item
            label="Default distribution"
            value={repository.default_distribution}
          />

          <InfoGrid.Item
            label="Default component"
            value={repository.default_component}
          />
        </InfoGrid>
      </Blocks.Item>
      <Blocks.Item title="Details">
        <LocalRepositoryPublicationsList repository={repository}/>
      </Blocks.Item>
    </Blocks>
  );
};

export default ViewLocalRepositoryDetailsTab;
