import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { PackageUpgrade } from "../../types/PackageUpgrade";
import AffectedInstancesModal from "../AffectedInstancesModal";

interface AffectedInstancesLinkProps {
  readonly upgrade: PackageUpgrade;
  readonly query?: string;
}

const AffectedInstancesLink: FC<AffectedInstancesLinkProps> = ({
  upgrade,
  query,
}) => {
  const {
    value: isModalVisible,
    setFalse: closeModal,
    setTrue: openModal,
  } = useBoolean();

  return (
    <>
      <Button
        className="u-no-padding--top u-no-margin--bottom u-align-text--left"
        appearance="link"
        onClick={openModal}
      >
        {pluralizeWithCount(upgrade.affected_instance_count, "instance")}
      </Button>
      {isModalVisible && (
        <AffectedInstancesModal
          upgrade={upgrade}
          query={query}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default AffectedInstancesLink;
