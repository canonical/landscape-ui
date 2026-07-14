import type { FC } from "react";
import Blocks from "@/components/layout/Blocks";
import InfoGrid from "@/components/layout/InfoGrid";
import LoadingState from "@/components/layout/LoadingState";
import {
  AssociatedPublicationsList,
  useGetPublicationsBySource,
} from "@/features/publications";
import type { Local } from "@canonical/landscape-openapi";
import {
  OperationStatusContent,
  type OperationMetadata,
} from "@/features/operations";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";

interface ViewLocalRepositoryDetailsTabProps {
  readonly repository: Local;
  readonly operationMetadata?: OperationMetadata;
}

const ViewLocalRepositoryDetailsTab: FC<ViewLocalRepositoryDetailsTabProps> = ({
  repository,
  operationMetadata,
}) => {
  const { publications, isGettingPublications } = useGetPublicationsBySource(
    repository.name,
  );

  return (
    <Blocks>
      <Blocks.Item title="Details">
        <InfoGrid dense>
          <InfoGrid.Item label="Name" large value={repository.displayName} />

          <InfoGrid.Item
            label="Status"
            value={
              <OperationStatusContent
                operationMetadata={operationMetadata}
                type="local"
                hasOperation={!!repository.lastOperation}
              />
            }
          />

          <InfoGrid.Item
            label="Last import"
            value={
              repository.lastImportTime
                ? moment(repository.lastImportTime).format(
                    DISPLAY_DATE_TIME_FORMAT,
                  )
                : null
            }
          />

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
          <AssociatedPublicationsList
            publications={publications}
            showSources={false}
          />
        )}
      </Blocks.Item>
    </Blocks>
  );
};

export default ViewLocalRepositoryDetailsTab;
