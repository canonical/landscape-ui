import type { FC } from "react";
import type { LocalRepository } from "../../../../types";
import { ResponsiveButtons } from "@/components/ui";
import { useGetRepositoryActions } from "../../../../hooks/useGetRepositoryActions";
import { useBoolean } from "usehooks-ts";
import { Button, Icon } from "@canonical/react-components";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import classes from "../../ViewLocalRepositorySidePanel.module.scss";
import type { Action } from "@/types/Action";

interface ViewRepositoryActionsBlockProps {
  readonly repository: LocalRepository;
}

const ViewRepositoryActionsBlock: FC<ViewRepositoryActionsBlockProps> = ({
  repository: repository,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { actions, destructiveActions } = useGetRepositoryActions({
    repository,
    openModal,
  });
  const buttons = [...actions, ...destructiveActions];
  const isNegative = (action: Action) => action.appearance === "negative";

  return (
    <>
      <ResponsiveButtons
        className={classes.marginBottom}
        buttons={buttons.map((button) => (
          <Button
            key={button.label}
            hasIcon
            type="button"
            onClick={button.onClick}
            aria-label={`${button.label} ${repository.display_name} local repository`}
            disabled={button.disabled}
          >
            <Icon
              name={
                isNegative(button) ? `${button.icon}--negative` : button.icon
              }
            />
            <span className={isNegative(button) ? "u-text--negative" : ""}>
              {button.label}
            </span>
          </Button>
        ))}
        collapseFrom={"xs"}
        menuPosition="left"
      />

      {isModalOpen &&
        <RemoveLocalRepositoryModal
          close={closeModal}
          repository={repository}
        />
      }
    </>
  );
};

export default ViewRepositoryActionsBlock;
