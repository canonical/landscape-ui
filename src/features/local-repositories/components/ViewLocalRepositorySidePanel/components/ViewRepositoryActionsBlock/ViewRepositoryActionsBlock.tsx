import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { ResponsiveButtons } from "@/components/ui";
import { useGetRepositoryActions } from "../../../../hooks/useGetRepositoryActions";
import { useBoolean } from "usehooks-ts";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import classes from "../../ViewLocalRepositorySidePanel.module.scss";
import PublishLocalRepositoryGuard from "../../../PublishLocalRepositoryGuard";

interface ViewRepositoryActionsBlockProps {
  readonly repository: Local;
  readonly isImporting: boolean;
}

const ViewRepositoryActionsBlock: FC<ViewRepositoryActionsBlockProps> = ({
  repository,
  isImporting,
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

  const { actions, destructiveAction } = useGetRepositoryActions({
    repository,
    isImporting,
    openRemovalModal,
    openPublishGuard,
  });
  const buttons = [...actions, destructiveAction];

  return (
    <>
      <ResponsiveButtons
        className={classes.marginBottom}
        buttons={buttons.map((action) => {
          const button = (
            <Button
              key={action.label}
              hasIcon
              type="button"
              className="u-no-margin--bottom"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <Icon
                name={`${action.icon}${action.appearance ? "--negative" : ""}`}
              />
              <span className={action.className}>{action.label}</span>
            </Button>
          );
          
          return action.tooltipMessage ? (
            <Tooltip
              message={action.tooltipMessage}
              position="btm-center"
            >
              {button}
            </Tooltip>
          ) : (button);
        })}
        collapseFrom="sm"
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
