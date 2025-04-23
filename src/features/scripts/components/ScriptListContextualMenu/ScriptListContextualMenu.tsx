import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useArchiveScriptModal, useDeleteScriptModal } from "../../hooks";
import type { Script } from "../../types";
import ScriptDetails from "../ScriptDetails";
import classes from "./ScriptListContextualMenu.module.scss";

const EditScriptForm = lazy(async () => import("../EditScriptForm"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptListContextualMenuProps {
  readonly script: Script;
}

const ScriptListContextualMenu: FC<ScriptListContextualMenuProps> = ({
  script,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const { setSidePanelContent } = useSidePanel();

  const handleScriptRun = (): void => {
    setSidePanelContent(
      `Run "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <RunScriptForm script={script} />
      </Suspense>,
    );
  };

  const handleViewScriptDetails = () => {
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} />
      </Suspense>,
    );
  };

  const handleEditScript = (): void => {
    setSidePanelContent(
      `Edit "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <EditScriptForm script={script} />
      </Suspense>,
    );
  };

  const handleOpenDeleteModal = (): void => {
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = (): void => {
    setDeleteModalOpen(false);
  };

  const handleOpenArchiveModal = (): void => {
    setArchiveModalOpen(true);
  };
  const handleCloseArchiveModal = (): void => {
    setArchiveModalOpen(false);
  };

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="play" />
          <span>Run script</span>
        </>
      ),
      "aria-label": `Run ${script.title} script`,
      hasIcon: true,
      onClick: (): void => {
        handleScriptRun();
      },
    },
    {
      children: (
        <>
          <Icon name="topic" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View ${script.title} details`,
      hasIcon: true,
      onClick: handleViewScriptDetails,
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${script.title} script`,
      hasIcon: true,
      onClick: (): void => {
        handleEditScript();
      },
    },
    {
      children: (
        <>
          <Icon name="archive--negative" />
          <span className={classes.negative}>Archive</span>
        </>
      ),
      "aria-label": `Archive ${script.title} script`,
      hasIcon: true,
      onClick: handleOpenArchiveModal,
      className: classes.separator,
    },
    {
      children: (
        <>
          <Icon name="delete--negative" />
          <span className={classes.negative}>Delete</span>
        </>
      ),
      "aria-label": `Delete ${script.title} script`,
      hasIcon: true,
      onClick: handleOpenDeleteModal,
    },
  ];

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    isArchiving,
    disabledArchiveConfirmation,
    onConfirmArchive,
  } = useArchiveScriptModal({
    script,
    afterSuccess: handleCloseArchiveModal,
  });

  const {
    deleteModalBody,
    deleteModalButtonLabel,
    deleteModalTitle,
    disabledDeleteConfirmation,
    isRemoving,
    onConfirmDelete,
  } = useDeleteScriptModal(script);

  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${script.title} actions` }}
        links={contextualMenuButtons}
      />

      {deleteModalOpen && (
        <ConfirmationModal
          title={deleteModalTitle}
          confirmButtonLabel={deleteModalButtonLabel}
          confirmButtonAppearance="negative"
          confirmButtonDisabled={disabledDeleteConfirmation}
          confirmButtonLoading={isRemoving}
          onConfirm={onConfirmDelete}
          close={handleCloseDeleteModal}
        >
          {deleteModalBody}
        </ConfirmationModal>
      )}

      {archiveModalOpen && (
        <ConfirmationModal
          title={archiveModalTitle}
          confirmButtonLabel={archiveModalButtonLabel}
          confirmButtonAppearance="negative"
          confirmButtonDisabled={disabledArchiveConfirmation}
          confirmButtonLoading={isArchiving}
          onConfirm={onConfirmArchive}
          close={handleCloseArchiveModal}
        >
          {archiveModalBody}
        </ConfirmationModal>
      )}
    </>
  );
};

export default ScriptListContextualMenu;
