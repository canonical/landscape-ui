import Blocks from "@/components/layout/Blocks";
import type { FC } from "react";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import type { Mirror, Publication } from "@canonical/landscape-openapi";

interface PublishMirrorContentsBlockProps {
  readonly mirror: Mirror;
  readonly publication: Publication;
}

const PublishMirrorContentsBlock: FC<PublishMirrorContentsBlockProps> = ({
  mirror,
  publication,
}) => {
  const architectures = publication.architectures ?? mirror.architectures ?? [];
  return (
    <Blocks.Item title="Contents">
      <ReadOnlyField
        label="Distribution"
        value={publication.distribution ?? mirror.distribution}
        tooltipMessage="You can’t change the contents of an existing publication."
      />
      <ReadOnlyField
        label="Components"
        value={mirror.components.join(", ")}
        tooltipMessage="The components are defined by the mirror."
      />
      <ReadOnlyField
        label="Architectures"
        value={architectures.join(", ")}
        tooltipMessage="You can’t change the contents of an existing publication."
      />
    </Blocks.Item>
  );
};

export default PublishMirrorContentsBlock;
