import Blocks from "@/components/layout/Blocks";
import type { FC } from "react";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import type { Mirror } from "@canonical/landscape-openapi";

interface PublishMirrorContentsBlockProps {
  readonly mirror: Mirror;
}

const PublishMirrorContentsBlock: FC<PublishMirrorContentsBlockProps> = ({
  mirror,
}) => {
  return (
    <Blocks.Item title="Contents">
      <ReadOnlyField
        label="Distribution"
        value={mirror.distribution ?? ""}
        tooltipMessage={"The distribution is defined by the mirror."}
      />
      <ReadOnlyField
        label="Components"
        value={mirror.components.join(", ")}
        tooltipMessage={"The components are defined by the mirror."}
      />
      <ReadOnlyField
        label="Architectures"
        value={mirror.architectures?.join(", ")}
        tooltipMessage={"The architectures are defined by the mirror."}
      />
    </Blocks.Item>
  );
};

export default PublishMirrorContentsBlock;
