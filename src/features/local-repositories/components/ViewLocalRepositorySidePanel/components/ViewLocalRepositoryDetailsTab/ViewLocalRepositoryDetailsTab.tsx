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
          <InfoGrid.Item label="Name" value={repository.display_name} />

          <InfoGrid.Item
            label="Description"
            large
            value={repository.comment}
          />

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
      <Blocks.Item title="Details">
        <LocalRepositoryPublicationsList repository={repository}/>
      </Blocks.Item>
    </Blocks>
  );
};

export default ViewLocalRepositoryDetailsTab;
