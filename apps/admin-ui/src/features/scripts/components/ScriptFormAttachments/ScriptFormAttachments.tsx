import { Input } from "@canonical/react-components";
import type { ChangeEventHandler, FC } from "react";
import type { Script, ScriptFormValues } from "../../types";
import AttachmentFile from "../AttachmentFile";
import classes from "./ScriptFormAttachments.module.scss";

interface ScriptFormAttachmentsProps {
  readonly attachments: ScriptFormValues["attachments"];
  readonly attachmentsToRemove: string[];
  readonly getFileInputError: (
    key: keyof ScriptFormValues["attachments"],
  ) => string | undefined;
  readonly initialAttachments: Script["attachments"];
  readonly onFileInputChange: (
    key: keyof ScriptFormValues["attachments"],
  ) => ChangeEventHandler<HTMLInputElement>;
  readonly onInitialAttachmentDelete: (attachment: string) => void;
  readonly scriptId?: number;
}

const ScriptFormAttachments: FC<ScriptFormAttachmentsProps> = ({
  attachments,
  attachmentsToRemove,
  getFileInputError,
  initialAttachments,
  onFileInputChange,
  onInitialAttachmentDelete,
  scriptId,
}) => {
  return (
    <>
      {Object.keys(attachments).map((attachmentsKey, index) => {
        const key = attachmentsKey as keyof ScriptFormValues["attachments"];
        const initialAttachment = initialAttachments[index];

        return !initialAttachment ||
          attachmentsToRemove.includes(initialAttachment.filename) ? (
          <Input
            key={key}
            type="file"
            label={`${key} attachment`}
            labelClassName="u-off-screen"
            onChange={onFileInputChange(key)}
            error={getFileInputError(key)}
          />
        ) : (
          <AttachmentFile
            className={classes.attachment}
            key={key}
            attachmentId={initialAttachment.id}
            filename={initialAttachment.filename}
            scriptId={scriptId}
            onInitialAttachmentDelete={() => {
              onInitialAttachmentDelete(initialAttachment.filename);
            }}
          />
        );
      })}
    </>
  );
};

export default ScriptFormAttachments;
