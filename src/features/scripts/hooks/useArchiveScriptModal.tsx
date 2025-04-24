import { useState, type ReactNode } from "react";
import type { Script } from "../types";
import { Input } from "@canonical/react-components";
import { useArchiveScript } from "../api";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "../styles.module.scss";

interface ArchiveModalResult {
  archiveModalTitle: string;
  archiveModalButtonLabel: string;
  disabledArchiveConfirmation: boolean;
  archiveModalBody: ReactNode;
  isArchivingScript: boolean;
  onConfirmArchive: () => Promise<void>;
  resetArchiveModal: () => void;
}

interface ArchiveModalProps {
  script: Script | null;
  afterSuccess: () => void;
}

export const useArchiveScriptModal = ({
  script,
  afterSuccess,
}: ArchiveModalProps): ArchiveModalResult => {
  const [confirmArchiveProfileText, setConfirmArchiveProfileText] =
    useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { archiveScript, isArchivingScript } = useArchiveScript();

  const handleChangeArchiveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmArchiveProfileText(e.target.value);
  };

  const reset = () => {
    setConfirmArchiveProfileText("");
  };

  const handleScriptArchive = async (): Promise<void> => {
    try {
      await archiveScript(script?.id || 0);

      afterSuccess();
      notify.success({
        message: `"${script?.title}" script archived successfully`,
        title: "Script archived",
      });
    } catch (error) {
      debug(error);
    }
  };

  const commonModalFields = {
    archiveModalTitle: `Archive ${script?.title}`,
    disabledArchiveConfirmation:
      confirmArchiveProfileText !== `archive ${script?.title}` ||
      isArchivingScript,
    isArchivingScript,
    onConfirmArchive: handleScriptArchive,
    resetArchiveModal: reset,
  };

  if (!script) {
    return {
      archiveModalTitle: "",
      archiveModalButtonLabel: "",
      disabledArchiveConfirmation: false,
      archiveModalBody: <></>,
      isArchivingScript: false,
      onConfirmArchive: async () => {
        debug("Script not loaded");
      },
      resetArchiveModal: reset,
    };
  }

  if (script.script_profiles.length === 0) {
    return {
      ...commonModalFields,
      archiveModalButtonLabel: "Archive",
      archiveModalBody: (
        <>
          <p>
            Archiving the script will prevent it from running in the future.
            <br />
            This action is <b>irreversible</b>.
          </p>
          <p className={classes.confirmationPrompt}>
            Type <b>archive {script.title}</b> to confirm.
          </p>
          <Input
            type="text"
            placeholder={`archive ${script.title}`}
            autoComplete="off"
            value={confirmArchiveProfileText}
            onChange={handleChangeArchiveText}
          />
        </>
      ),
    };
  }

  return {
    ...commonModalFields,
    archiveModalButtonLabel: "Archive both script and profiles",
    archiveModalBody: (
      <>
        <p>
          Archiving the script will prevent it from running in the future.
          <br />
          The script is associated with the following profiles:
        </p>
        <ul>
          {script.script_profiles.map((profile) => (
            <li key={profile.id}>{profile.title}</li>
          ))}
        </ul>
        <p>
          If you archive the script and the profiles, they won’t be able to run
          in the future.
          <br />
          This action is <b>irreversible</b>.
        </p>
        <p className={classes.confirmationPrompt}>
          Type <b>archive {script.title}</b> to confirm.
        </p>
        <Input
          type="text"
          placeholder={`archive ${script.title}`}
          autoComplete="off"
          value={confirmArchiveProfileText}
          onChange={handleChangeArchiveText}
        />
      </>
    ),
  };
};
