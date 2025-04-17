import { lazy, Suspense, useState, type FC } from "react";
import { useGetSingleScript } from "@/features/scripts";
import {
  Button,
  ConfirmationButton,
  Icon,
  Input,
  Notification,
} from "@canonical/react-components";
import { useArchiveScript, useGetSingleScriptAttachments } from "../../api";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import moment from "moment";
import useSidePanel from "@/hooks/useSidePanel";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";

const ScriptDetailsTabs = lazy(async () => import("../ScriptDetailsTabs"));

const ScriptsVersionHistory = lazy(
  async () => import("../ScriptsVersionHistory"),
);

const SingleScript = lazy(async () => import("../SingleScript"));

interface ScriptDetailsProps {
  readonly scriptId: number;
}

const ScriptDetails: FC<ScriptDetailsProps> = ({ scriptId }) => {
  const [confirmArchiveProfileText, setConfirmArchiveProfileText] =
    useState("");

  const { script } = useGetSingleScript(scriptId);
  const { scriptAttachments } = useGetSingleScriptAttachments(scriptId, {
    enabled: !!script && script.attachments.length > 0,
  });
  const { setSidePanelContent } = useSidePanel();
  const debug = useDebug();
  const { notify } = useNotify();

  const { archiveScript, isArchiving } = useArchiveScript(scriptId);

  const loaded = !!script;

  const viewVersionHistory = (): void => {
    if (script === null) {
      debug("Script not loaded");
      return;
    }
    setSidePanelContent(
      script.title,
      <Suspense fallback={<LoadingState />}>
        <ScriptsVersionHistory
          script={script}
          viewVersionHistory={viewVersionHistory}
        />
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
        <SingleScript action="edit" script={script} />
      </Suspense>,
    );
  };

  const handleScriptArchive = async (): Promise<void> => {
    try {
      await archiveScript();

      notify.success({
        message: `"${script?.title}" script archived successfully`,
        title: "Script archived",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleChangeArchiveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmArchiveProfileText(e.target.value);
  };

  if (script?.status === "redacted") {
    return (
      <Notification severity="caution" className="u-no-margin">
        <p>
          <b>Script deleted:</b> The script was deleted by{" "}
          {script.last_edited_by} on{" "}
          {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
        </p>
      </Notification>
    );
  }

  return (
    <>
      {script?.status === "archived" ? (
        <Notification severity="caution" className="u-no-margin">
          <p>
            <b>Script deleted:</b> The script was archived by{" "}
            {script.last_edited_by} on{" "}
            {moment(script.last_edited_at).format(DISPLAY_DATE_TIME_FORMAT)}
          </p>
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
            confirmationModalProps={{
              children: (
                <>
                  {/**
                   * // TODO add modal body
                   */}
                  Type <b>delete {script?.title}</b> to confirm.
                  <Input
                    type="text"
                    value={confirmArchiveProfileText}
                    onChange={handleChangeArchiveText}
                  />
                </>
              ),
              title: "Archive script",
              confirmButtonAppearance: "negative",
              confirmButtonLabel: "Archive",
              confirmButtonDisabled:
                confirmArchiveProfileText !== `archive ${script?.title}` ||
                isArchiving,
              confirmButtonLoading: isArchiving,
              onConfirm: handleScriptArchive,
            }}
          >
            Archive
          </ConfirmationButton>
        </div>
      </div>
      {loaded ? (
        <Suspense fallback={<LoadingState />}>
          <ScriptDetailsTabs
            script={script}
            scriptAttachments={scriptAttachments}
            viewVersionHistory={viewVersionHistory}
          />
        </Suspense>
      ) : (
        <LoadingState />
      )}
    </>
  );
};

export default ScriptDetails;
