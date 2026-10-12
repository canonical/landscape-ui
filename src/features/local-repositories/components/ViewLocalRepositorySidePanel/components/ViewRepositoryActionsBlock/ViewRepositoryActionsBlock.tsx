import type { FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { ResponsiveButtons } from "@/components/ui";
import { useGetRepositoryActions } from "../../../../hooks/useGetRepositoryActions";
import { useBoolean } from "usehooks-ts";
import { Button, Icon, Tooltip } from "@canonical/react-components";
import RemoveLocalRepositoryModal from "../../../RemoveLocalRepositoryModal";
import classes from "./ViewRepositoryActionsBlock.module.scss";
import PublishLocalRepositoryGuard from "../../../PublishLocalRepositoryGuard";
import RestartImportModal from "../../../RestartImportModal";

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

  const {
    value: isCancelImportModalOpen,
    setTrue: openCancelImportModal,
    setFalse: closeCancelImportModal,
  } = useBoolean();

  const { actions, destructiveAction, openImportPackages } =
    useGetRepositoryActions({
      repository,
      isImporting,
      openCancelImportModal,
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

          return action.disabled ? (
            <Tooltip
              message="You must wait for this action to be completed to import more packages."
              position="btm-center"
              key={action.label}
            >
              {button}
            </Tooltip>
          ) : (
            button
          );
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

      <RestartImportModal
        close={closeCancelImportModal}
        isOpen={isCancelImportModalOpen}
        repository={repository}
        onContinue={openImportPackages}
      />
    </>
  );
};

export default ViewRepositoryActionsBlock;
