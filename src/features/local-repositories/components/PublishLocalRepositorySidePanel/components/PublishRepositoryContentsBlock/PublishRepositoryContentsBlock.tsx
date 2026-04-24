import Blocks from "@/components/layout/Blocks";
import type { FC } from "react";
import type { Local } from "../../../../types";
import ReadOnlyField from "@/components/form/ReadOnlyField";

interface PublishRepositoryContentsBlockProps {
  readonly repository: Local;
}

const PublishRepositoryContentsBlock: FC<
  PublishRepositoryContentsBlockProps
> = ({ repository }) => {
  return (
    <Blocks.Item title="Contents">
      <ReadOnlyField
        label="Distribution"
        value={repository.distribution}
        tooltipMessage={"The distribution is defined by the repository."}
      />

      <ReadOnlyField
        label="Component"
        value={repository.component}
        tooltipMessage={"The component is defined by the repository."}
      />
    </Blocks.Item>
  );
};

export default PublishRepositoryContentsBlock;
