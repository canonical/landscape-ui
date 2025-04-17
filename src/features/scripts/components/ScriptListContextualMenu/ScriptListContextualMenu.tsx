/* eslint-disable @typescript-eslint/no-unused-vars */
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  Input,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import {
  useArchiveScript,
  useGetAssociatedScriptProfiles,
  useRemoveScript,
} from "../../api";
import type { Script, SingleScript } from "../../types";
import ScriptDetails from "../ScriptDetails";
import { getArchiveModalBody, getDeleteModalBody } from "./helpers";
import classes from "./ScriptListContextualMenu.module.scss";

const SingleScript = lazy(async () => import("../SingleScript"));
const RunScriptForm = lazy(async () => import("../RunScriptForm"));

interface ScriptListContextualMenuProps {
  readonly script: Script;
}

const ScriptListContextualMenu: FC<ScriptListContextualMenuProps> = ({
  script,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");
  const [confirmArchiveProfileText, setConfirmArchiveProfileText] =
    useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { removeScript, isRemoving } = useRemoveScript(script.id);
  const { archiveScript, isArchiving } = useArchiveScript(script.id);

  const { associatedScriptProfiles, isAssociatedScriptProfilesLoading } =
    useGetAssociatedScriptProfiles(script.id, {
      enabled: deleteModalOpen || archiveModalOpen,
    });

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
        <SingleScript action="edit" script={script} />
      </Suspense>,
    );
  };

  const handleScriptRemove = async (): Promise<void> => {
    try {
      await removeScript();

      notify.success({
        message: `"${script.title}" script removed successfully`,
        title: "Script removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleScriptArchive = async (): Promise<void> => {
    try {
      await archiveScript();

      notify.success({
        message: `"${script.title}" script archived successfully`,
        title: "Script archived",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleOpenDeleteModal = (): void => {
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = (): void => {
    setDeleteModalOpen(false);
  };
  const handleChangeDeleteText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(e.target.value);
  };

  const handleOpenArchiveModal = (): void => {
    setArchiveModalOpen(true);
  };
  const handleCloseArchiveModal = (): void => {
    setArchiveModalOpen(false);
  };
  const handleChangeArchiveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmArchiveProfileText(e.target.value);
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

  const { body: deleteModalBody, buttonLabel: deleteModalButtonLabel } =
    getDeleteModalBody(associatedScriptProfiles);
  const { body: archiveModalBody, buttonLabel: archiveModalButtonLabel } =
    getArchiveModalBody(associatedScriptProfiles);

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
          title="Remove script"
          confirmButtonLabel={deleteModalButtonLabel}
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            confirmDeleteProfileText !== `delete ${script.title}` || isRemoving
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleScriptRemove}
          close={handleCloseDeleteModal}
        >
          {deleteModalBody}
          Type <b>delete {script.title}</b> to confirm.
          <Input
            type="text"
            value={confirmDeleteProfileText}
            onChange={handleChangeDeleteText}
          />
        </ConfirmationModal>
      )}

      {archiveModalOpen && (
        <ConfirmationModal
          title="Archive script"
          confirmButtonLabel={archiveModalButtonLabel}
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            confirmArchiveProfileText !== `archive ${script.title}` ||
            isArchiving
          }
          confirmButtonLoading={isArchiving}
          onConfirm={handleScriptArchive}
          close={handleCloseArchiveModal}
        >
          {archiveModalBody}
          Type <b>delete {script.title}</b> to confirm.
          <Input
            type="text"
            value={confirmArchiveProfileText}
            onChange={handleChangeArchiveText}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default ScriptListContextualMenu;
