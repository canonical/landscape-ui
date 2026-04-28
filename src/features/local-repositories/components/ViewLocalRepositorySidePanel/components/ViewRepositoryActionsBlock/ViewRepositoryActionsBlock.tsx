import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { ResponsiveButtons } from "@/components/ui";
import { useGetRepositoryActions } from "../../../../hooks/useGetRepositoryActions";
import { useBoolean } from "usehooks-ts";
import { Button, Icon } from "@canonical/react-components";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import classes from "../../ViewLocalRepositorySidePanel.module.scss";
import type { Action } from "@/types/Action";
import PublishLocalRepositoryGuard from "../../../PublishLocalRepositoryGuard";

interface ViewRepositoryActionsBlockProps {
  readonly repository: Local;
}

const ViewRepositoryActionsBlock: FC<ViewRepositoryActionsBlockProps> = ({
  repository: repository,
}) => {
  const {
    value: isRemovalModalOpen,
    setTrue: openRemovalModal,
    setFalse: closeRemovalModal,
  } = useBoolean();

  const {
    value: isPublishGuardOpen,
    setTrue: openPublishGuard,
    setFalse: closePublishGuard,
  } = useBoolean();

  const { actions, destructiveActions } = useGetRepositoryActions({
    repository,
    openRemovalModal,
    openPublishGuard,
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
            aria-label={`${button.label} ${repository.displayName} local repository`}
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

      <RemoveLocalRepositoryModal
        close={closeRemovalModal}
        isOpen={isRemovalModalOpen}
        repository={repository}
      />

      <PublishLocalRepositoryGuard
        close={closePublishGuard}
        isOpen={isPublishGuardOpen}
        repository={repository}
      />
    </>
  );
};

export default ViewRepositoryActionsBlock;
