import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { useGetSingleScript } from "@/features/scripts";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  ConfirmationButton,
  Icon,
  Notification,
} from "@canonical/react-components";
import moment from "moment";
import { lazy, Suspense, type FC } from "react";
import { useArchiveScriptModal } from "../../hooks";
import type { ScriptTabId } from "../../types";

const ScriptDetailsTabs = lazy(async () => import("../ScriptDetailsTabs"));

const EditScriptForm = lazy(async () => import("../EditScriptForm"));

interface ScriptDetailsProps {
  readonly scriptId: number;
  readonly initialTabId?: ScriptTabId;
}

const ScriptDetails: FC<ScriptDetailsProps> = ({
  scriptId,
  initialTabId = "info",
}) => {
  const { setSidePanelContent, closeSidePanel } = useSidePanel();
  const debug = useDebug();

  const { script } = useGetSingleScript(scriptId);

  const {
    archiveModalBody,
    archiveModalButtonLabel,
    archiveModalTitle,
    disabledArchiveConfirmation,
    isArchivingScript,
    onConfirmArchive,
    resetArchiveModal,
  } = useArchiveScriptModal({
    script,
    afterSuccess: closeSidePanel,
  });

  const viewVersionHistory = (): void => {
    if (script === null) {
      debug("Script not loaded");
      return;
    }

    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptDetails scriptId={script.id} initialTabId="version-history" />
      </Suspense>,
    );
  };

  const handleEditScript = (): void => {
    if (script === null) {
      debug("Script not loaded");
      return;
    }
    setSidePanelContent(
      `Edit "${script.title}" script`,
      <Suspense fallback={<LoadingState />}>
        <EditScriptForm script={script} />
      </Suspense>,
    );
  };

  if (script?.status === "REDACTED") {
    return (
      <Notification severity="caution" className="u-no-margin">
        <b>Script deleted:</b> The script was deleted by{" "}
        {script.last_edited_by.name} on{" "}
        {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
      </Notification>
    );
  }

  return (
    <>
      {script?.status === "ARCHIVED" ? (
        <Notification severity="caution">
          <b>Script archived:</b> The script was archived by{" "}
          {script.last_edited_by.name} on{" "}
          {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
        </Notification>
      ) : null}

      <div className="p-segmented-control">
        <div className="p-segmented-control__list">
          <Button
            type="button"
            className="p-segmented-control__button"
            onClick={handleEditScript}
            hasIcon
          >
            <Icon name="edit" />
            <span>Edit</span>
          </Button>
          <ConfirmationButton
            className="p-segmented-control__button"
            type="button"
            confirmationModalProps={{
              children: archiveModalBody,
              title: archiveModalTitle,
              confirmButtonAppearance: "negative",
              confirmButtonLabel: archiveModalButtonLabel,
              confirmButtonDisabled: disabledArchiveConfirmation,
              confirmButtonLoading: isArchivingScript,
              onConfirm: onConfirmArchive,
              close: resetArchiveModal,
            }}
          >
            Archive
          </ConfirmationButton>
        </div>
      </div>
      {script ? (
        <Suspense fallback={<LoadingState />}>
          <ScriptDetailsTabs
            script={script}
            viewVersionHistory={viewVersionHistory}
            initialTabId={initialTabId}
          />
        </Suspense>
      ) : (
        <LoadingState />
      )}
    </>
  );
};

export default ScriptDetails;
