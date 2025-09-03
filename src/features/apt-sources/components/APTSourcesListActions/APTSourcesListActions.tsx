import ListActions from "@/components/layout/ListActions";
import { ICONS } from "@canonical/react-components";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { APTSource } from "../../types";
import APTSourceDeleteModal from "./components/APTSourceDeleteModal";

interface APTSourcesListActionsProps {
  readonly aptSource: APTSource;
}

const APTSourcesListActions: FC<APTSourcesListActionsProps> = ({
  aptSource,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  return (
    <>
      <ListActions
        toggleAriaLabel={`${aptSource.name} APT source actions`}
        destructiveActions={[
          {
            icon: ICONS.delete,
            label: "Delete",
            "aria-label": `Remove ${aptSource.name} APT source`,
            onClick: openModal,
          },
        ]}
      />

      <APTSourceDeleteModal
        aptSource={aptSource}
        close={closeModal}
        opened={isModalOpen}
      />
    </>
  );
};

export default APTSourcesListActions;
